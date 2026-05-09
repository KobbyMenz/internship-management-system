import classes from "../Table/Table.module.css";

const Table = ({ data }) => {
  return (
    <>
      <table className={classes.table}>
        <thead className={classes.thead}>
          <tr>
            <th>#</th>
            <th>Email</th>
            {/* <th>Password</th> */}
            <th>Gender</th>
            <th>Colour</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.email}</td>
              {/* <td>{item.password}</td> */}
              <td>{item.gender}</td>
              <td>{item.color}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export default Table;
