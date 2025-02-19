import { Card, Row, Col } from "antd";
import { memo, useState, useEffect } from "react";
import { fetchData } from "../../../api";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    fetchData().then((data) => {
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("API response is not an array:", data);
      }
    });
  }, []);

  return (
    <div className="sub-container" id="products">
      <h2>Products For You</h2>
      <Row gutter={[16, 16]}>
        {products.length > 0 ? (
          products.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={<img alt={product.name} src={product.image} />}
                onClick={() => navigate(`/product/${product.id}`)} // Navigate to Product Detail
              >
                <Card.Meta title={product.name} description={`$${product.price}`} />
              </Card>
            </Col>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </Row>
    </div>
  );
};

export default memo(Products);
