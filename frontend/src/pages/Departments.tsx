import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { toast } from 'react-toastify';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  reset,
  Department,
} from '../features/departments/departmentSlice';

const Departments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { departments, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.departments
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    _id: '',
    department_name: '',
    description: '',
    is_active: true,
  });

  const { department_name, description, is_active } = formData;

  useEffect(() => {
    dispatch(getDepartments());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && showModal) {
      setShowModal(false);
      setFormData({
        _id: '',
        department_name: '',
        description: '',
        is_active: true,
      });
      toast.success(`Department ${isEdit ? 'updated' : 'created'} successfully!`);
    }
  }, [isError, isSuccess, message, showModal, isEdit]);

  const handleOpenModal = (department: Department | null = null) => {
    if (department) {
      setIsEdit(true);
      setCurrentDepartment(department);
      setFormData({
        _id: department._id,
        department_name: department.department_name,
        description: department.description || '',
        is_active: department.is_active,
      });
    } else {
      setIsEdit(false);
      setCurrentDepartment(null);
      setFormData({
        _id: '',
        department_name: '',
        description: '',
        is_active: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: value,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const departmentData = {
      department_name,
      description,
      is_active,
    };

    if (!department_name) {
      toast.error('Please enter a department name');
      return;
    }

    if (isEdit) {
      dispatch(
        updateDepartment({
          departmentId: formData._id,
          departmentData,
        })
      );
    } else {
      dispatch(createDepartment(departmentData));
    }
  };

  const onDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      dispatch(deleteDepartment(id));
    }
  };

  const onToggleStatus = (department: any) => {
    const departmentData = {
      is_active: !department.is_active,
    };

    dispatch(
      updateDepartment({
        departmentId: department._id,
        departmentData,
      })
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white me-2">
            <i className="mdi mdi-crosshairs-gps"></i>
          </span>{" "}
          Departments
        </h3>
        <nav aria-label="breadcrumb">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => handleOpenModal()}
          >
            <i className="mdi mdi-plus"></i> Add Department
          </button>
        </nav>
      </div>

      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Departments List</h4>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Department Head</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((department) => (
                      <tr key={department._id}>
                        <td>{department.department_name}</td>
                        <td>
                          {typeof department.department_head === 'object' && department.department_head
                            ? `${department.department_head.first_name} ${department.department_head.last_name}`
                            : 'Not Assigned'}
                        </td>
                        <td>{department.description}</td>
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
                        <td>
                          <button
                            type="button"
                            className="btn btn-gradient-info btn-sm me-1"
                            onClick={() => handleOpenModal(department)}
                          >
                            <i className="mdi mdi-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-gradient-danger btn-sm me-1"
                            onClick={() => onDelete(department._id)}
                          >
                            <i className="mdi mdi-delete"></i>
                          </button>
                          <button
                            type="button"
                            className={`btn ${
                              department.is_active
                                ? "btn-gradient-warning"
                                : "btn-gradient-success"
                            } btn-sm`}
                            onClick={() => onToggleStatus(department)}
                          >
                            <i
                              className={`mdi ${
                                department.is_active ? "mdi-close" : "mdi-check"
                              }`}
                            ></i>
                          </button>
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

      {/* Department Modal */}
      {showModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEdit ? 'Edit' : 'Add'} Department
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <form onSubmit={onSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="department_name">Department Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="department_name"
                      name="department_name"
                      value={department_name}
                      onChange={onChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={description}
                      onChange={onChange}
                      rows={3}
                    ></textarea>
                  </div>
                  {isEdit && (
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="is_active"
                        name="is_active"
                        checked={is_active}
                        onChange={onChange}
                      />
                      <label className="form-check-label" htmlFor="is_active">
                        Active
                      </label>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments; 