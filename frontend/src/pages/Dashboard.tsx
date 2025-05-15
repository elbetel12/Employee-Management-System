import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { getDepartments } from '../features/departments/departmentSlice';
import { getEmployees } from '../features/employees/employeeSlice';

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { departments } = useSelector((state: RootState) => state.departments);
  const { employees } = useSelector((state: RootState) => state.employees);

  const [maleEmployees, setMaleEmployees] = useState(0);
  const [femaleEmployees, setFemaleEmployees] = useState(0);
  const [activeEmployees, setActiveEmployees] = useState(0);
  const [inactiveEmployees, setInactiveEmployees] = useState(0);

  useEffect(() => {
    dispatch(getDepartments());
    dispatch(getEmployees());
  }, [dispatch]);

  useEffect(() => {
    // Calculate statistics
    if (employees.length > 0) {
      const male = employees.filter((emp) => emp.gender === 'Male').length;
      const female = employees.filter((emp) => emp.gender === 'Female').length;
      const active = employees.filter((emp) => emp.is_active).length;
      const inactive = employees.filter((emp) => !emp.is_active).length;

      setMaleEmployees(male);
      setFemaleEmployees(female);
      setActiveEmployees(active);
      setInactiveEmployees(inactive);
    }
  }, [employees]);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white me-2">
            <i className="mdi mdi-home"></i>
          </span>{" "}
          Dashboard
        </h3>
      </div>

      <div className="row">
        <div className="col-md-4 stretch-card grid-margin">
          <div className="card bg-gradient-danger card-img-holder text-white">
            <div className="card-body">
              <img
                src="/assets/images/dashboard/circle.svg"
                className="card-img-absolute"
                alt="circle-image"
              />
              <h4 className="font-weight-normal mb-3">
                Total Employees{" "}
                <i className="mdi mdi-account-multiple mdi-24px float-right"></i>
              </h4>
              <h2 className="mb-5">{employees.length}</h2>
              <h6 className="card-text">Active: {activeEmployees}</h6>
              <h6 className="card-text">Inactive: {inactiveEmployees}</h6>
            </div>
          </div>
        </div>
        <div className="col-md-4 stretch-card grid-margin">
          <div className="card bg-gradient-info card-img-holder text-white">
            <div className="card-body">
              <img
                src="/assets/images/dashboard/circle.svg"
                className="card-img-absolute"
                alt="circle-image"
              />
              <h4 className="font-weight-normal mb-3">
                Departments{" "}
                <i className="mdi mdi-bookmark-outline mdi-24px float-right"></i>
              </h4>
              <h2 className="mb-5">{departments.length}</h2>
              <h6 className="card-text">
                Active: {departments.filter(d => d.is_active).length}
              </h6>
            </div>
          </div>
        </div>
        <div className="col-md-4 stretch-card grid-margin">
          <div className="card bg-gradient-success card-img-holder text-white">
            <div className="card-body">
              <img
                src="/assets/images/dashboard/circle.svg"
                className="card-img-absolute"
                alt="circle-image"
              />
              <h4 className="font-weight-normal mb-3">
                Gender Distribution{" "}
                <i className="mdi mdi-diamond mdi-24px float-right"></i>
              </h4>
              <h2 className="mb-5">
                {maleEmployees} / {femaleEmployees}
              </h2>
              <h6 className="card-text">Male / Female</h6>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Recent Employees</h4>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th> Name </th>
                      <th> Department </th>
                      <th> Position </th>
                      <th> Phone </th>
                      <th> Status </th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.slice(0, 5).map((employee) => (
                      <tr key={employee._id}>
                        <td>
                          {employee.first_name} {employee.last_name}
                        </td>
                        <td>
                          {typeof employee.department === 'object'
                            ? employee.department.department_name
                            : 'Loading...'}
                        </td>
                        <td>{employee.position}</td>
                        <td>{employee.phone}</td>
                        <td>
                          <div
                            className={`badge ${
                              employee.is_active
                                ? "badge-gradient-success"
                                : "badge-gradient-danger"
                            }`}
                          >
                            {employee.is_active ? "ACTIVE" : "INACTIVE"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Departments</h4>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th> Department Name </th>
                      <th> Department Head </th>
                      <th> Status </th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.slice(0, 5).map((department) => (
                      <tr key={department._id}>
                        <td>{department.department_name}</td>
                        <td>
                          {typeof department.department_head === 'object' && department.department_head
                            ? `${department.department_head.first_name} ${department.department_head.last_name}`
                            : 'Not Assigned'}
                        </td>
                        <td>
                          <div
                            className={`badge ${
                              department.is_active
                                ? "badge-gradient-success"
                                : "badge-gradient-danger"
                            }`}
                          >
                            {department.is_active ? "ACTIVE" : "INACTIVE"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 