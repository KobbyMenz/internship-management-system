import axios from "axios";
import dayjs from "dayjs";
import { useState, useEffect, useRef, useCallback } from "react";
import app_api_url from "../../app_api_url";

/**
 * Hook to automatically calculate election status based on current time
 * and update the database when status changes
 * @param {string|number} electionId - Election ID for database updates
 * @param {string|Date} startDate - Election start date
 * @param {string|Date} endDate - Election end date
 * @param {string} initialStatus - Initial status from props (fallback)
 * @param {function} onStatusChange - Callback when status changes
 * @returns {string} Calculated status: "Upcoming", "Active", or "Closed"
 */
export const useElectionStatus = (
  electionId,
  startDate,
  endDate,
  initialStatus = "Upcoming",
  onStatusChange = null,
) => {
  const [status, setStatus] = useState(initialStatus);
  const previousStatusRef = useRef(initialStatus);
  const updateAttemptedRef = useRef(false);

  // Calculate status based on dates (memoized)
  const calculateStatus = useCallback(() => {
    // Return initial status if parameters are missing
    if (!startDate || !endDate) {
      return initialStatus;
    }

    try {
      const now = dayjs();
      const start = dayjs(startDate);
      const end = dayjs(endDate);

      // Validate dates
      if (!start.isValid() || !end.isValid()) {
        console.error(
          `[Election ${electionId}] Invalid dates. Start: ${startDate}, End: ${endDate}`,
        );
        return initialStatus;
      }

      if (now >= end) {
        return "Closed";
      } else if (now >= start) {
        return "Active";
      } else {
        return "Upcoming";
      }
    } catch (error) {
      console.error(
        `[Election ${electionId}] Error calculating status:`,
        error,
      );
      return initialStatus;
    }
  }, [startDate, endDate, initialStatus, electionId]);

  // Update election status in database
  const updateElectionStatusInDB = useCallback(
    async (newStatus) => {
      // Only update once per status change to avoid duplicate requests
      if (updateAttemptedRef.current === newStatus) {
        return false;
      }

      updateAttemptedRef.current = newStatus;

      try {
        // Convert ID to string for URL
        const idString = String(electionId);
        const url = `${app_api_url}/api/updateElectionStatus/${idString}`;

        console.log(
          `[Election ${electionId}] Updating status to: ${newStatus}`,
          `URL: ${url}`,
        );

        const response = await axios.put(
          url,
          { status: newStatus },
          { timeout: 5000 },
        );

        if (response.status === 200) {
          console.log(
            `✓ [Election ${electionId}] Status updated to ${newStatus}`,
            response.data,
          );
          if (onStatusChange) {
            onStatusChange(newStatus);
          }
          return true;
        }
      } catch (err) {
        console.error(`✗ [Election ${electionId}] Status update failed:`, {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        // Reset so it will try again next time
        updateAttemptedRef.current = false;
      }
      return false;
    },
    [electionId, onStatusChange],
  );

  // Setup effect to monitor and update status
  useEffect(() => {
    console.log(
      `[Election ${electionId}] Starting status monitor. Initial: ${initialStatus}`,
    );

    // Function to check and update status
    const checkAndUpdateStatus = () => {
      const newStatus = calculateStatus();
      const statusChanged = newStatus !== previousStatusRef.current;

      if (statusChanged) {
        console.log(
          `[Election ${electionId}] Status changed: ${previousStatusRef.current} → ${newStatus} at ${new Date().toLocaleTimeString()}`,
        );
        previousStatusRef.current = newStatus;
        setStatus(newStatus);

        // Update database when status changes
        updateElectionStatusInDB(newStatus);
      }
    };

    // Check immediately on mount
    checkAndUpdateStatus();

    // Poll every 5 seconds
    const pollInterval = setInterval(checkAndUpdateStatus, 5000);

    // Schedule exact time checks at start and end dates
    const now = dayjs();
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const scheduledTimeouts = [];

    // Schedule check at start date
    if (now < start && start.isValid()) {
      const msUntilStart = start.diff(now, "milliseconds");
      // Only schedule if within 7 days
      if (msUntilStart > 0 && msUntilStart < 604800000) {
        console.log(
          `[Election ${electionId}] Start date in ${Math.round(msUntilStart / 1000)}s - will auto-update`,
        );
        const timeout = setTimeout(() => {
          console.log(
            `[Election ${electionId}] Start time reached - updating status...`,
          );
          checkAndUpdateStatus();
        }, msUntilStart + 500); // Add buffer
        scheduledTimeouts.push(timeout);
      }
    }

    // Schedule check at end date
    if (now < end && end.isValid()) {
      const msUntilEnd = end.diff(now, "milliseconds");
      // Only schedule if within 7 days
      if (msUntilEnd > 0 && msUntilEnd < 604800000) {
        console.log(
          `[Election ${electionId}] End date in ${Math.round(msUntilEnd / 1000)}s - will auto-update`,
        );
        const timeout = setTimeout(() => {
          console.log(
            `[Election ${electionId}] End time reached - updating status...`,
          );
          checkAndUpdateStatus();
        }, msUntilEnd + 500); // Add buffer
        scheduledTimeouts.push(timeout);
      }
    }

    // Cleanup
    return () => {
      clearInterval(pollInterval);
      scheduledTimeouts.forEach(clearTimeout);
    };
  }, [
    calculateStatus,
    updateElectionStatusInDB,
    electionId,
    startDate,
    endDate,
    initialStatus,
  ]);

  return status;
};
