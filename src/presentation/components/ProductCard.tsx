import { useAppDispatch, useWishlist } from '@/application/store/hooks';
import { addToCart } from '@/application/store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/application/store/slices/wishlistSlice';
import type { ProductDTO } from '@/infrastructure/api/techHavenApiClient';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '@/styles/components/ProductCard.scss';

interface ProductCardProps {
  product: ProductDTO;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: wishlistItems } = useWishlist();
  const isInWishlist = wishlistItems.some((item) => item.product.id === product.id);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ product, quantity: 1 }));
    setTimeout(() => {
      navigate('/cart');
    }, 300);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const discountedPrice =
    product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;

  return (
    <article className="product-card-modern">
      <div className="product-image-container">
        <img src={product.imageUrl} className="product-image" alt={product.name} />
        {product.discount > 0 && <span className="discount-badge">🔥 -{product.discount}%</span>}
        <button
          className={`wishlist-btn ${isInWishlist ? 'in-wishlist' : ''}`}
          onClick={handleToggleWishlist}
          title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <i className={`bi bi-heart${isInWishlist ? '-fill' : ''}`}></i>
        </button>
      </div>
      <div className="card-body">
        <h6 className="product-title">{product.name}</h6>

        <div className="rating-section">
          <div className="stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <i
                key={`star-${product.id}-${i}`}
                className={`bi bi-star${i < 4 || i === 4 ? '-fill' : '-half'} star`}
              ></i>
            ))}
          </div>
          <small className="rating-text">(4.5)</small>
        </div>

        <div className="price-section">
          {product.discount > 0 && (
            <span className="original-price">${product.price.toFixed(2)}</span>
          )}
          <span className="discount-price">${discountedPrice.toFixed(2)}</span>
        </div>
      </div>
      <div className="card-footer">
        <button className="action-btn add-to-cart-btn" onClick={handleAddToCart}>
          <i className="bi bi-bag-plus"></i>
          {t('common.add')}
        </button>
        <button className="action-btn buy-now-btn" onClick={handleBuyNow}>
          <i className="bi bi-cart-check"></i>
          {t('productPage.buyNow')}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
