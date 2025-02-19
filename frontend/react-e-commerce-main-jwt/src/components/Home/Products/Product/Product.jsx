import "./Product.css";
import { FaStar } from "react-icons/fa";
import { useGlobalContext } from "@/components/GlobalContext/GlobalContext";
import { Button,Modal } from "antd";

const Product = ({ product }) => {
  let { store } = useGlobalContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const showModal = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  let stars = [];
  const rating = product?.rating || 0;
  for (let i = 0; i < rating; i++) {
    stars.push(<FaStar key={i} />);
  }

  const isInCart = product?.addedToCart;

  return (
    <div className="product-container">
      <div className="image" onClick={() => showModal(product)}>
        <img
          src={product?.image || "/placeholder.jpg"}
          alt={product?.name || "Product Image"}
          width="100%"
        />
      </div>
      <div className="product-details">
        <div className="price">
          <div className="name-price-product">
            <h4>{product?.name}</h4>
            <h5>
              $<span className="actual-product-price">{product?.price}.00</span>
            </h5>
          </div>
        </div>
        <div>
          {!isInCart ? (
            <button
              className="add-to-cart"
              onClick={() => store.addToCart(product?.id)}
            >
              Add to Cart
            </button>
          ) : (
            <button
              className="add-to-cart"
              onClick={() => store.removeFromCart(product?.id)}
            >
              Remove from cart
            </button>
          )}
        </div>
      </div>

      {/* Modal for product details */}
      <Modal
        title={selectedProduct?.name || "Product Details"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        <div>
          <img
            src={selectedProduct?.image || "/placeholder.jpg"}
            alt={selectedProduct?.name || "Product Image"}
            style={{ width: "100%", marginBottom: "20px" }}
          />
          <p><strong>Price:</strong> ${selectedProduct?.price}.00</p>
          <p><strong>Description:</strong> {selectedProduct?.description}</p>
          <div className="star-rating">
            <div className="star">{stars}</div>
            <span>({parseInt(Math.random() * 100)} Reviews)</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Product
