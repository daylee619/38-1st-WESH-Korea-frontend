import React, { useCallback, useState } from 'react';
import { API } from '../../../config';
import './Orderlist.scss';

const Orderlist = ({
  orderproduct,
  checkProduct,
  totalPrice,
  setTotalPrice,
  orderData,
  onDelete,
}) => {
  const { product_id, product_name, product_price, product_quantity } =
    orderproduct;
  const [totalProductPrice, setTotalProductPrice] = useState(0);
  const [quantityNum, setQuantityNum] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [opacity, setOpacity] = useState('order-list');

  const deleteClick = e => {
    fetch(`${API.cart}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({
        product_info: { product_id: product_id },
      }),
    });
    onDelete(product_id);
  };
  const checkedValue = e => {
    setIsChecked(e.target.checked);
    opacity !== 'order-list-real'
      ? setOpacity('order-list-real')
      : setOpacity('order-list');
  };

  const plus = e => {
    setTotalProductPrice(prev => parseInt(prev) + parseInt(product_price));
    setTotalPrice(
      parseInt(product_price * product_quantity) +
        parseInt(quantityNum * product_price.slice(0, product_price.length - 4))
    );
    setQuantityNum(prev => prev + 1);
  };

  const minus = () => {
    if (totalPrice > 0) {
      setTotalProductPrice(prev => parseInt(prev) - parseInt(product_price));
      setTotalPrice(
        parseInt(totalProductPrice * product_quantity) +
          parseInt(
            totalProductPrice -
              (orderData + quantityNum) *
                product_price.slice(0, product_price.length - 4)
          )
      );
    }
    setQuantityNum(prev => prev - 1);
  };

  return (
    <div className={opacity}>
      <input
        type="checkbox"
        className="box-tag"
        onClick={e => {
          checkProduct(e);
          checkedValue(e);
        }}
      />
      <div className="order-product-info">
        <div className="product-img">
          <img src={orderproduct.product_img} className="img-one" />
        </div>

        <span className="product_name">{product_name}</span>
      </div>
      <div className="order-quantity-btn">
        <button
          type="button"
          className="order-button-left"
          disabled={quantityNum + product_quantity === 1 ? true : false}
          onClick={isChecked === true && minus}
        >
          -
        </button>
        <input
          className="order-quantity"
          type="text"
          value={orderData + quantityNum - 1}
        />
        <button
          type="button"
          className="order-button-right"
          onClick={isChecked === true && plus}
        >
          +
        </button>
      </div>

      <div className="order-product-price">
        <span className="price">
          ￦ {product_price.slice(0, product_price.length - 4)}
        </span>
      </div>

      <div className="order-total">
        <div className="order-total-price">
          <span className="total">
            ￦
            {(orderData + quantityNum - 1) *
              product_price.slice(0, product_price.length - 4)}
          </span>
        </div>
        <div className="order-button-select">
          <button className="select" type="button" onClick={deleteClick}>
            선택 삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orderlist;
