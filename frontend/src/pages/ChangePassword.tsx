import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { changePassword, reset } from '../features/auth/authSlice';
import { AppDispatch, RootState } from '../store';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { currentPassword, newPassword, confirmPassword } = formData;

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success('Password changed successfully');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }

    dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password should be at least 6 characters');
      return;
    }

    dispatch(
      changePassword({
        currentPassword,
        newPassword,
      })
    );
  };

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white me-2">
            <i className="mdi mdi-lock"></i>
          </span>{" "}
          Change Password
        </h3>
      </div>

      <div className="row">
        <div className="col-md-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Change Your Password</h4>
              <p className="card-description">
                Enter your current password and new password below
              </p>
              <form className="forms-sample" onSubmit={onSubmit}>
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="currentPassword"
                    name="currentPassword"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    name="newPassword"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={onChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-gradient-primary me-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword; 