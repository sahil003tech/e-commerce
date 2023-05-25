import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinners from "./Spinners";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: existingcategory,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, SetPrice] = useState(existingPrice || "");
  const [category, Setcategory] = useState(existingcategory || "");
  const [images, SetImages] = useState(existingImages || []);
  const [goToProduct, setGoToProduct] = useState(false);
  const [isUploading, setisUploading] = useState(false);
  const [categories, Setcategories] = useState([]);
  const router = useRouter();
  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      Setcategories(result.data);
    });
  }, []);
  async function saveProduct(ev) {
    ev.preventDefault();
    const data = { title, description, price, images, category };
    if (_id) {
      //update

      await axios.put("/api/Product", { ...data, _id });
    } else {
      //create

      await axios.post("/api/Product", data);
    }
    setGoToProduct(true);
  }
  if (goToProduct) {
    router.push("/Product");
  }
  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setisUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }

      const res = await axios.post("/api/upload", data);
      SetImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setisUploading(false);
    }
  }
  function uploadImagesorder(images) {
    SetImages(images);
  }
  return (
    <form onSubmit={saveProduct}>
      <label>Product Name</label>
      <input
        type="text"
        placeholder="product name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>
        Category
        <select value={category} onChange={(e) => Setcategory(e.target.value)}>
          <option value="">Uncategorized</option>
          {categories.length > 0 &&
            categories.map((e) => <option value={e._id}>{e.name}</option>)}
        </select>
      </label>
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable
          className="flex flex-wrap gap-1"
          list={images}
          setList={uploadImagesorder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div key={link} className="h-24">
                <img src={link} alt="" className=" rounded-lg" />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 p-1 flex items-center">
            <Spinners />
          </div>
        )}
        <label className="w-24 h-24 border text-center flex items-center justify-center  text-sm gap-1 rounded-md bg-gray-300 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Upload</div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
        {!images?.length && <div>No photos in this products</div>}
      </div>
      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      ></textarea>
      <label>Price (in INR)</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(ev) => SetPrice(ev.target.value)}
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
