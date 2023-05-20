import { useState } from "react";
import {
  useUpdateUserMutation,
  useAddNewUserMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
} from "./userApiSlice";

const EditUser = () => {
  const [addNewUser, response] = useAddNewUserMutation();
  const [deletePost] = useDeleteUserMutation();
  const [inputField, setInputField] = useState({
    id: "",
    fullname: "",
    email: "",
    password: "",
  });
  const inputsHandler = (e) => {
    setInputField((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const setUserData = (data) => {
    setInputField({
      id: data.id,
      fullname: data.fullname,
      email: data.email,
      password: data.password,
    });
    console.log("data", data);
  };
  const onEditData = () => {
    updateUser({
      id: inputField.id,
      fullname: inputField.fullname,
      email: inputField.email,
      password: inputField.password,
    });
    setInputField(() => ({
      id: "",
      fullname: "",
      email: "",
      password: "",
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { fullname, email, password } = e.target.elements;
    setInputField((inputField) => ({
      ...inputField,
      [e.target.name]: e.target.value,
    }));
    let formData = {
      fullname: fullname.value,
      email: email.value,
      password: password.value,
    };
    addNewUser(formData)
      .unwrap()
      .then(() => {
        setInputField(() => ({
          id: "",
          fullname: "",
          email: "",
          password: "",
        }));
      })
      .then((error) => {
        console.log(error);
      });
  };
  const {
    data: posts,
    isLoading: isGetLoading,
    isSuccess: isGetSuccess,
    isError: isGetError,
    error: getError,
  } = useGetUsersQuery({ refetchOnMountOrArgChange: true });
  let postContent;
  if (isGetLoading) {
    postContent = (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  } else if (isGetSuccess) {
    postContent = posts.map((item) => {
      return (
        <div className="col-lg-12 mb-3" key={item.id}>
          <div className="card alert alert-secondary">
            <div className="card-body">
              <h5 className="card-title">{item.fullname}</h5>
              <p className="card-text">{item.email}</p>
              <p className="card-text">{item.password}</p>
              <button
                onClick={() => deletePost(item.id)}
                className="btn btn-outline-danger me-2"
              >
                Remove
              </button>
              <button
                onClick={() => setUserData(item)}
                className="btn btn-outline-primary"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      );
    });
  } else if (isGetError) {
    postContent = (
      <div className="alert alert-danger" role="alert">
        {getError}
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-md-4 offset-md-*">
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">
              <strong>fullname</strong>
            </label>
            <input
              value={inputField.fullname}
              type="text"
              className="form-control"
              name="fullname"
              id="fullname"
              onChange={inputsHandler}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              <strong>Enter email</strong>
            </label>
            <input
              value={inputField.email}
              className="form-control"
              rows="3"
              name="email"
              id="email"
              onChange={inputsHandler}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              <strong>Enter password</strong>
            </label>
            <input
              value={inputField.password}
              className="form-control"
              rows="3"
              name="password"
              id="password"
              onChange={inputsHandler}
            />
          </div>
          <button className="btn btn-danger me-2" type="submit">
            Submit
          </button>
          <button
            onClick={onEditData}
            className="btn btn-primary"
            type="button"
          >
            Update
          </button>
        </form>
      </div>
      <div className="col-lg-8">
        <div className="row">{postContent}</div>
      </div>
    </div>
  );
};

export default EditUser;
