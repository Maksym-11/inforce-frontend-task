import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setProducts, setSortBy } from '../redux/productsSlice';
import Modal from './Modal';

function ProductList() {
  const { products, sortBy } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then((res) => res.json())
      .then((data) => dispatch(setProducts(data)));
  }, [dispatch]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name) || a.count - b.count;
    return a.count - b.count;
  });

  const handleAddProduct = (data) => {
    if (!data.name || !data.count) {
      alert('Fill all fields');
      return;
    }
    fetch('http://localhost:3001/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: Date.now(), ...data, comments: [] }),
    }).then(() => {
      fetch('http://localhost:3001/products')
        .then((res) => res.json())
        .then((data) => dispatch(setProducts(data)));
      setIsAddModalOpen(false);
    });
  };

  const handleDeleteProduct = (id) => {
    fetch(`http://localhost:3001/products/${id}`, { method: 'DELETE' }).then(() => {
      fetch('http://localhost:3001/products')
        .then((res) => res.json())
        .then((data) => dispatch(setProducts(data)));
      setIsDeleteModalOpen(null);
    });
  };

  return (
    <div>
      <h1>Product List</h1>
      <select onChange={(e) => dispatch(setSortBy(e.target.value))} value={sortBy}>
        <option value="name">Sort by Name</option>
        <option value="count">Sort by Count</option>
      </select>
      <button onClick={() => setIsAddModalOpen(true)}>Add Product</button>
      <ul>
        {sortedProducts.map((product) => (
          <li key={product.id}>
            <Link to={`/products/${product.id}`}>{product.name} ({product.count})</Link>
            <button onClick={() => setIsDeleteModalOpen(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {isAddModalOpen && (
        <Modal
          onSubmit={handleAddProduct}
          onCancel={() => setIsAddModalOpen(false)}
          fields={['name', 'count', 'imageUrl', 'width', 'height', 'weight']}
        />
      )}
      {isDeleteModalOpen && (
        <Modal
          onSubmit={() => handleDeleteProduct(isDeleteModalOpen)}
          onCancel={() => setIsDeleteModalOpen(null)}
          message="Are you sure you want to delete this product?"
        />
      )}
    </div>
  );
}

export default ProductList;