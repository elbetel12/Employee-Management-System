import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { login, reset } from '../features/auth/authSlice';
import { RootState, AppDispatch } from '../store';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { username, password } = formData;

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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userData = {
      username,
      password,
    };

    dispatch(login(userData));
  };

  return (
    <div className="container-scroller">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth auth-bg-1 theme-one">
          <div className="row w-100">
            <div className="col-lg-4 mx-auto">
              <div className="auto-form-wrapper">
                <div className="brand-logo text-center mb-4">
                  <img src="/images/ems-logo.svg" alt="logo" />
                </div>
                <form onSubmit={onSubmit}>
                  <div className="form-group">
                    <label className="label">Username</label>
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
                          <i className="mdi mdi-check-circle-outline"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="label">Password</label>
                    <div className="input-group">
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="*********"
                        value={password}
                        onChange={onChange}
                      />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <i className="mdi mdi-check-circle-outline"></i>
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
                      {isLoading ? 'Loading...' : 'Login'}
                    </button>
                  </div>
                  <div className="text-block text-center my-3">
                    <span className="text-small font-weight-semibold">Not a member ?</span>
                    <Link to="/register" className="text-black text-small ms-1">Create new account</Link>
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

export default Login;

// 
