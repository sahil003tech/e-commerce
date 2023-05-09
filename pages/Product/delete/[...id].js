import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProductPage() {
  const router = useRouter();
  const [productInfo, setProductInfo] = useState();
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/Product?id=" + id).then((response) => {
      setProductInfo(response.data);
    });
  }, [id]);
  function goBack() {
    router.push("/Product");
  }
  async function click() {
    await axios.delete("/api/Product?id=" + id);
    goBack();
  }
  return (
    <Layout>
      <h1>Are you Sure to delelte the '{productInfo?.title}'</h1>
      <button className=" btn-primary mr-2" onClick={click}>
        Yes
      </button>
      <button className="btn-primary" onClick={goBack}>
        No
      </button>
    </Layout>
  );
}
