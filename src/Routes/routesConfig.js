import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import RegisterVoters from "../pages/RegisterVoters/RegisterVoters";
import ManageUsers from "../pages/ManageUsers/ManageUsers";
import VoterDashboard from "../pages/VoterDashboard/VoterDashboard";
import ROLES from "../Utils/ROLES";

const routesConfig = [
  {
    //Admin Routes
    role: ROLES.ADMIN,
    routes: [
      { path: "/admin/dashboard", component: AdminDashboard },
      { path: "/admin/register", component: RegisterVoters },
      { path: "/admin/manage_users", component: ManageUsers },
    ],
  },

  {
    //Manager Routes
    role: ROLES.VOTER,
    routes: [{ path: "/voter/dashboard", component: VoterDashboard }],
  },
];
export default routesConfig;
