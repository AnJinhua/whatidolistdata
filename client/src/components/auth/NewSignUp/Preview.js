import { ComponentsContainer } from "./styles";

const Preview = ({ handlePage, register }) => {
  return (
    <ComponentsContainer>
      <div className="input-container margin">
        <span className="input-header">first name</span>
        <input
          type="text"
          placeholder="first name"
          {...register("firstName")}
          disabled={true}
          className="input"
        />
      </div>
      <div className="input-container margin">
        <span className="input-header">last name</span>
        <input
          type="text"
          placeholder="last name"
          {...register("lastName")}
          disabled={true}
          className="input"
        />
      </div>

      <div className="input-container margin">
        <span className="input-header">Email</span>
        <input
          type="email"
          placeholder="email"
          {...register("email")}
          disabled
          className="input"
        />
      </div>

      <div className="input-container margin">
        <span className="input-header">category</span>
        <input
          type="text"
          placeholder="category"
          {...register("category")}
          disabled
          className="input"
        />
      </div>

      <div className="input-container margin">
        <span className="input-header">sub-category</span>
        <input
          type="text"
          placeholder="subcategory"
          {...register("subCategory")}
          className="input"
          disabled
        />
      </div>

      <button
        className="next-btn"
        onClick={() => handlePage(4)}
        style={{ marginBottom: "20px" }}
      >
        Continue
      </button>
    </ComponentsContainer>
  );
};

export default Preview;
