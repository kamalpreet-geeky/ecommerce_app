import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Card, Spin, Button, Input, Select } from "antd";
import { fabric } from "fabric";
import { fetchData } from "../api";

const { Option } = Select;

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [textColor, setTextColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textInput, setTextInput] = useState("");

  useEffect(() => {
    fetchData().then((data) => {
      const foundProduct = data.find((p) => p.id === parseInt(id));
      setProduct(foundProduct);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (product && product.image) {
      fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
        width: 400,
        height: 400,
        backgroundColor: "#f0f0f0",
      });

      fabric.Image.fromURL(product.image, (img) => {
        img.scaleToWidth(400);
        fabricCanvas.current.setBackgroundImage(img, fabricCanvas.current.renderAll.bind(fabricCanvas.current));
      });

      fabricCanvas.current.on("selection:created", (event) => {
        setSelectedObject(event.target);
        if (event.target.type === "i-text") {
          setTextInput(event.target.text);
        }
      });

      fabricCanvas.current.on("selection:cleared", () => {
        setSelectedObject(null);
        setTextInput("");
      });

      return () => {
        fabricCanvas.current.dispose();
      };
    }
  }, [product]);

  const addText = () => {
    const text = new fabric.IText("Double-click to edit", {
      left: 100,
      top: 100,
      fontSize: 24,
      fill: textColor,
      fontFamily: fontFamily,
      editable: true, // Enables text editing
    });
    fabricCanvas.current.add(text);
    fabricCanvas.current.setActiveObject(text);
    fabricCanvas.current.renderAll();
  };

  const addRectangle = () => {
    const rect = new fabric.Rect({
      left: 50,
      top: 50,
      width: 100,
      height: 50,
      fill: "blue",
      stroke: "black",
      strokeWidth: 2,
      selectable: true,
    });

    fabricCanvas.current.add(rect);
    fabricCanvas.current.setActiveObject(rect);
    fabricCanvas.current.renderAll();
  };

  const changeTextColor = (color) => {
    setTextColor(color);
    if (selectedObject && selectedObject.type === "i-text") {
      selectedObject.set("fill", color);
      fabricCanvas.current.renderAll();
    }
  };

  const changeFontFamily = (font) => {
    setFontFamily(font);
    if (selectedObject && selectedObject.type === "i-text") {
      selectedObject.set("fontFamily", font);
      fabricCanvas.current.renderAll();
    }
  };

  const updateTextValue = (e) => {
    const newText = e.target.value;
    setTextInput(newText);
    if (selectedObject && selectedObject.type === "i-text") {
      selectedObject.set("text", newText);
      fabricCanvas.current.renderAll();
    }
  };

  const deleteSelectedObject = () => {
    if (selectedObject) {
      fabricCanvas.current.remove(selectedObject);
      fabricCanvas.current.discardActiveObject();
      fabricCanvas.current.renderAll();
      setSelectedObject(null);
      setTextInput("");
    }
  };

  if (loading) return <Spin size="large" />;
  if (!product) return <h2>Product not found</h2>;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <Card title={product.name} style={{ marginBottom: "20px" }}>
        <p>{product.description}</p>
        <h3>Price: ${product.price}</h3>
      </Card>

      {/* Fabric.js Canvas */}
      <canvas ref={canvasRef} style={{ border: "1px solid #ddd" }} />

      <div style={{ marginTop: "10px", display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
        <Button onClick={addText} type="primary">
          Add Text
        </Button>

        <Button onClick={addRectangle} type="default">
          Add Rectangle
        </Button>

        <Button onClick={deleteSelectedObject} type="danger" disabled={!selectedObject}>
          Delete Selected
        </Button>

        <Input
          value={textInput}
          onChange={updateTextValue}
          placeholder="Edit text..."
          disabled={!selectedObject || selectedObject.type !== "i-text"}
          style={{ width: "200px" }}
        />

        <Input
          type="color"
          value={textColor}
          onChange={(e) => changeTextColor(e.target.value)}
          disabled={!selectedObject || selectedObject.type !== "i-text"}
          style={{ width: "50px" }}
        />

        <Select
          value={fontFamily}
          onChange={changeFontFamily}
          disabled={!selectedObject || selectedObject.type !== "i-text"}
          style={{ width: "120px" }}
        >
          <Option value="Arial">Arial</Option>
          <Option value="Times New Roman">Times New Roman</Option>
          <Option value="Courier New">Courier New</Option>
          <Option value="Verdana">Verdana</Option>
        </Select>
      </div>
    </div>
  );
};

export default ProductDetail;
