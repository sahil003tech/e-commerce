import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Categories() {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState([]);
  const [parentCategory, SetParentCategory] = useState("");
  const [properties, Setproperties] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, []);
  function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setCategory(result.data);
    });
  }
  async function saveCategory(e) {
    e.preventDefault();
    if (editedCategory) {
      await axios.put("/api/categories", {
        name,
        parentCategory,
        _id: editedCategory._id,
      });
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", { name, parentCategory });
    }
    setName("");
    fetchCategories();
  }
  function editCategory(categories) {
    setEditedCategory(categories);
    setName(categories.name);
    SetParentCategory(categories.parent?._id);
  }
  async function deleteCategories(categories) {
    const { _id } = categories;
    await axios.delete("/api/categories?_id=" + _id);
    fetchCategories();
  }
  function addProperty() {
    Setproperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }
  function handlepropertynamechange(index, property, newName) {
    Setproperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }
  function handlepropertyvaluechange(index, property, newValues) {
    Setproperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }
  function removeProperty(indexToRemove) {
    Setproperties((prev) => {
      return [...prev].filter((p, pindex) => {
        return pindex !== indexToRemove;
      });
    });
  }
  return (
    <Layout>
      <h1>categories</h1>
      <label>
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : "Create New Category"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            value={parentCategory}
            onChange={(e) => SetParentCategory(e.target.value)}
          >
            <option>No parent Category</option>
            {category.length > 0 &&
              category.map((categories) => (
                <option value={categories._id}>{categories.name}</option>
              ))}
          </select>
        </div>
        <div className="mb-2 ">
          <label className="block">Properties</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default text-sm"
          >
            Add new Property
          </button>
        </div>
        {properties.length > 0 &&
          properties.map((property, index) => (
            <div className="flex gap-1 mb-2">
              <input
                type="text"
                className="mb-0"
                onChange={(e) =>
                  handlepropertynamechange(index, property, e.target.value)
                }
                value={properties.name}
                placeholder="property name (example:color)"
              />
              <input
                type="text"
                className="mb-0"
                onChange={(e) =>
                  handlepropertyvaluechange(index, property, e.target.value)
                }
                value={properties.values}
                placeholder="values,comma separated"
              />
              <button
                onClick={() => removeProperty(index)}
                type="button"
                className="btn-default"
              >
                Remove
              </button>
            </div>
          ))}

        <button className="btn-primary py-1" type="Submit">
          Save
        </button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent Name</td>
          </tr>
        </thead>
        <tbody>
          {category.length > 0 &&
            category.map((categories) => (
              <tr>
                <td>{categories.name}</td>
                <td>{categories?.parent?.name}</td>
                <td>
                  <button
                    onClick={() => editCategory(categories)}
                    className="btn-primary mr-1"
                  >
                    EDIT
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => deleteCategories(categories)}
                  >
                    DELETE
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
