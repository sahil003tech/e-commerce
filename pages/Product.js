import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

function Product() {
  const [product, SetProduct] = useState([]);
  useEffect(() => {
    axios.get("/api/Product").then((response) => {
      SetProduct(response.data);
    });
  }, []);
  return (
    <Layout>
      <Link className="bg-green-700 text-white py-1 px-2" href={"/Product/new"}>
        Add New Products
      </Link>
      <table className="basic mt-2">
        <thead>
          <tr>
            <td>Product Name</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {product.map((product) => (
            <tr>
              <td>{product.title}</td>
              <td>
                <Link href={"/Product/edit/" + product._id}>Edit</Link>
                <Link href={"/Product/delete/" + product._id}>Delete</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default Product;
