import styles from "../SearchBar/SearchBar.module.css";
import PropTypes from "prop-types";
import SearchIcon from "../Icons/SearchIcon";

const SearchBar = (props) => {
  return (
    <>
      <div className={styles.search_container}>
        <div className={styles.search}>
          <input
            className={styles.input}
            placeholder={props.placeholder}
            type="search"
            name={props.name}
            value={props.value}
            id="search"
            onChange={props.onChange}
          />

          <label className={styles.search__icon} htmlFor="search">
            <SearchIcon />
          </label>
        </div>
      </div>
    </>
  );
};

SearchBar.propTypes = {
  name: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};
export default SearchBar;
