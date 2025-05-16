import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Modal from './Modal';

function ProductView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
    fetch(`http://localhost:3001/comments?productId=${id}`)
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, [id]);

  const handleEditProduct = (data) => {
    fetch(`http://localhost:3001/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, ...data }),
    }).then(() => {
      fetch(`http://localhost:3001/products/${id}`)
        .then((res) => res.json())
        .then((data) => setProduct(data));
      setIsEditModalOpen(false);
    });
  };

  const handleAddComment = () => {
    if (!newComment) return;
    fetch('http://localhost:3001/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: Date.now(),
        productId: Number(id),
        description: newComment,
        date: new Date().toLocaleString(),
      }),
    }).then(() => {
      fetch(`http://localhost:3001/comments?productId=${id}`)
        .then((res) => res.json())
        .then((data) => setComments(data));
      setNewComment('');
    });
  };

  const handleDeleteComment = (commentId) => {
    fetch(`http://localhost:3001/comments/${commentId}`, { method: 'DELETE' }).then(() => {
      fetch(`http://localhost:3001/comments?productId=${id}`)
        .then((res) => res.json())
        .then((data) => setComments(data));
    });
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <img src={product.imageUrl} alt={product.name} width="150" />
      <p>Count: {product.count}</p>
      <p>Size: {product.size.width}x{product.size.height}</p>
      <p>Weight: {product.weight}</p>
      <button onClick={() => setIsEditModalOpen(true)}>Edit</button>
      <h2>Comments</h2>
      <input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add comment" />
      <button onClick={handleAddComment}>Add Comment</button>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            {comment.description} ({comment.date})
            <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {isEditModalOpen && (
        <Modal
          onSubmit={handleEditProduct}
          onCancel={() => setIsEditModalOpen(false)}
          fields={['name', 'count', 'imageUrl', 'width', 'height', 'weight']}
          defaultValues={product}
        />
      )}
    </div>
  );
}

export default ProductView;