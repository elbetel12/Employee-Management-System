import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '../store';
import { register, reset } from '../features/auth/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    role: 'user'
  });

  const { username, password, first_name, last_name, email, role } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password || !first_name || !last_name || !email) {
      toast.error('Please fill in all fields');
      return;
    }

    const userData = {
      username,
      password,
      first_name,
      last_name,
      email,
      role
    };

    dispatch(register(userData));
  };

  return (
    <div className="container-scroller">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth register-bg-1 theme-one">
          <div className="row w-100">
            <div className="col-lg-4 mx-auto">
              <div className="auto-form-wrapper">
                <div className="brand-logo text-center mb-4">
                  <img src="/images/ems-logo.svg" alt="logo" />
                </div>
                <h4 className="text-center mb-4">Register</h4>
                <form onSubmit={onSubmit}>
                  <div className="form-group">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        placeholder="Username"
                        value={username}
                        onChange={onChange}
                      />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <i className="mdi mdi-account"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        id="first_name"
                        name="first_name"
                        placeholder="First Name"
                        value={first_name}
                        onChange={onChange}
                      />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <i className="mdi mdi-account-outline"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        id="last_name"
                        name="last_name"
                        placeholder="Last Name"
                        value={last_name}
                        onChange={onChange}
                      />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <i className="mdi mdi-account-outline"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={onChange}
                      />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <i className="mdi mdi-email-outline"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group">
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={onChange}
                      />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <i className="mdi mdi-lock-outline"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group">
                      <select
                        className="form-control"
                        id="role"
                        name="role"
                        value={role}
                        onChange={onChange}
                      >
                        <option value="user">Employee</option>
                        <option value="hr">HR</option>
                        <option value="admin">Admin</option>
                      </select>
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <i className="mdi mdi-account-key"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <button
                      type="submit"
                      className="btn btn-primary submit-btn btn-block"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Register'}
                    </button>
                  </div>
                  <div className="text-block text-center my-3">
                    <span className="text-small font-weight-semibold">Already have an account ?</span>
                    <Link to="/login" className="text-black text-small ms-1">Login</Link>
                  </div>
                </form>
              </div>
              <p className="footer-text text-center">
                Copyright © {new Date().getFullYear()} EMS. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 