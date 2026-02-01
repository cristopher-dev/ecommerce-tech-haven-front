import { useAppDispatch } from "@/application/store/hooks";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/application/store/slices/wishlistSlice";
import { RootState } from "@/application/store/store";
import { TechHavenApiProductRepository } from "@/infrastructure/adapters/TechHavenApiRepositories";
import type { ProductDTO } from "@/infrastructure/api/techHavenApiClient";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../../infrastructure/hooks/useCart";
import Footer from "../components/Footer";
import Header from "../components/Header";

const LoadingView: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Header />
      <main className="container my-4">
        <div className="text-center">
          <output className="spinner-border">
            <span className="visually-hidden">{t("common.loading")}</span>
          </output>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const NotFoundView: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Header />
      <main className="container my-4">
        <div className="alert alert-danger">
          {t("productPage.notFound")} <Link to="/">{t("common.back")}</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

interface SearchResultsViewProps {
  products: ProductDTO[];
  searchQuery: string | null;
}

const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  products,
  searchQuery,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.product.id === productId);
  };

  const handleWishlistToggle = (p: ProductDTO) => {
    if (isInWishlist(p.id)) {
      dispatch(removeFromWishlist(Number.parseInt(p.id)));
    } else {
      const product = {
        id: p.id,
        name: p.name,
        price: p.price / 100,
        image: p.imageUrl,
        discount: 0,
        stock: p.stock,
        description: p.description,
      };
      dispatch(addToWishlist(product));
    }
  };

  return (
    <div>
      <Header />
      <main className="container my-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">{t("header.home")}</Link>
            </li>
            <li className="breadcrumb-item active">
              {t("productPage.searchResults")}
            </li>
          </ol>
        </nav>

        <h2 className="mb-4">
          {t("productPage.searchFor")} "{searchQuery}"
          {products.length > 0 && (
            <span className="text-muted ms-2">
              ({products.length} {t("productPage.found")})
            </span>
          )}
        </h2>

        {products.length === 0 ? (
          <div className="alert alert-info">
            {t("productPage.noFound")} "{searchQuery}".{" "}
            <Link to="/">{t("common.back")}</Link>
          </div>
        ) : (
          <div className="row">
            {products.map((p) => (
              <div key={p.id} className="col-md-4 mb-4">
                <div className="card h-100">
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img
                      src={p.imageUrl}
                      className="card-img-top"
                      alt={p.name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <button
                      className="btn btn-sm"
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: isInWishlist(p.id)
                          ? "#ff6b6b"
                          : "rgba(255,255,255,0.9)",
                        color: isInWishlist(p.id) ? "white" : "#333",
                        border: "none",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        padding: "0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() => handleWishlistToggle(p)}
                      title={
                        isInWishlist(p.id)
                          ? t("productPage.removeFromWishlist")
                          : t("productPage.addToWishlist")
                      }
                    >
                      <i
                        className={`bi ${
                          isInWishlist(p.id) ? "bi-heart-fill" : "bi-heart"
                        }`}
                        style={{ fontSize: "18px" }}
                      ></i>
                    </button>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="text-muted small">{p.description}</p>
                    <p className="card-text text-success fw-bold">
                      ${(p.price / 100).toFixed(2)}
                    </p>
                    <small className="text-muted">
                      {t("productPage.stock")}: {p.stock}{" "}
                      {t("productPage.units")}
                    </small>
                  </div>
                  <div className="card-footer bg-transparent d-grid gap-2">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        addToCart(
                          {
                            id: Number.parseInt(p.id),
                            name: p.name,
                            price: p.price / 100,
                            image: p.imageUrl,
                            discount: 0,
                          },
                          1,
                        );
                      }}
                      disabled={p.stock === 0}
                    >
                      {p.stock === 0
                        ? t("productPage.outOfStock")
                        : t("common.add")}
                    </button>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => {
                        addToCart(
                          {
                            id: Number.parseInt(p.id),
                            name: p.name,
                            price: p.price / 100,
                            image: p.imageUrl,
                            discount: 0,
                          },
                          1,
                        );
                        setTimeout(() => {
                          navigate("/cart");
                        }, 300);
                      }}
                      disabled={p.stock === 0}
                    >
                      <i className="bi bi-cart-check me-1"></i>
                      {t("productPage.buyNow")}
                    </button>
                    <Link
                      to={`/product?id=${p.id}`}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      {t("productPage.viewDetails")}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

interface ButtonContentParams {
  isAdding: boolean;
  isOutOfStock: boolean;
  t: ReturnType<typeof useTranslation>["t"];
  isBuyButton?: boolean;
}

const getButtonContent = ({
  isAdding,
  isOutOfStock,
  t,
  isBuyButton,
}: ButtonContentParams): React.ReactNode => {
  let label = "";
  if (isAdding) {
    label = isBuyButton ? t("common.loading") : t("productPage.adding");
  } else if (isOutOfStock) {
    label = t("productPage.outOfStock");
  } else if (!isAdding && !isOutOfStock) {
    label = isBuyButton ? t("productPage.buyNow") : t("productPage.addToCart");
  }

  if (isAdding) {
    return (
      <>
        <output className="spinner-border spinner-border-sm me-2"></output>
        {label}
      </>
    );
  }

  if (isBuyButton && !isAdding && !isOutOfStock) {
    return (
      <>
        <i className="bi bi-cart-check me-2"></i>
        {label}
      </>
    );
  }

  return label;
};

const ProductPage: React.FC = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showToast, setShowToast] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const rawProductId = searchParams.get("id") || "1";
  const searchQuery = searchParams.get("search");
  const productId = /^\d+$/.test(rawProductId)
    ? `prod-${rawProductId}`
    : rawProductId;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const repo = new TechHavenApiProductRepository();

        if (searchQuery) {
          setIsSearchMode(true);
          const searchResults = await repo.search(searchQuery);
          setProducts(searchResults);
          setProduct(null);
        } else {
          setIsSearchMode(false);
          const data = await repo.getById(productId);
          setProduct(data);
          setProducts([]);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [productId, searchQuery]);

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAdding(true);
    addToCart(
      {
        id: Number.parseInt(product.id),
        name: product.name,
        price: product.price / 100,
        image: product.imageUrl,
        discount: 0,
      },
      1,
    );
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
    setTimeout(() => {
      setIsAdding(false);
      navigate("/cart");
    }, 500);
  };

  const handleBuyNow = async () => {
    if (!product) return;

    setIsAdding(true);
    addToCart(
      {
        id: Number.parseInt(product.id),
        name: product.name,
        price: product.price / 100,
        image: product.imageUrl,
        discount: 0,
      },
      1,
    );
    setTimeout(() => {
      setIsAdding(false);
      navigate("/cart");
    }, 300);
  };

  if (loading) {
    return <LoadingView />;
  }

  if (isSearchMode) {
    return <SearchResultsView products={products} searchQuery={searchQuery} />;
  }

  if (!product) {
    return <NotFoundView />;
  }

  const isOutOfStock = product.stock === 0;

  const addToCartButtonContent = getButtonContent({
    isAdding,
    isOutOfStock,
    t,
    isBuyButton: false,
  });

  const buyNowButtonContent = getButtonContent({
    isAdding,
    isOutOfStock,
    t,
    isBuyButton: true,
  });

  return (
    <div>
      <Header />
      <main className="container my-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">{t("header.home")}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {t("productPage.title")}
            </li>
          </ol>
        </nav>
        <div className="row">
          <div className="col-md-6">
            <img src={product.imageUrl} alt="Product" className="img-fluid" />
          </div>
          <div className="col-md-6">
            <h1>{product.name}</h1>
            <p className="text-muted">${(product.price / 100).toFixed(2)}</p>
            <p className="text-success">
              {t("productPage.stock")}: {product.stock} {t("productPage.units")}
            </p>
            <p>{product.description}</p>
            <div className="d-flex gap-2 flex-wrap">
              <button
                className="btn btn-primary"
                onClick={handleAddToCart}
                disabled={isAdding || product.stock === 0}
              >
                {addToCartButtonContent}
              </button>
              <button
                className="btn btn-success"
                onClick={handleBuyNow}
                disabled={isAdding || product.stock === 0}
              >
                {buyNowButtonContent}
              </button>
            </div>
          </div>
        </div>
      </main>
      {showToast && (
        <div
          className="toast-container position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 1050 }}
        >
          <div
            className="toast show bg-success text-white"
            role="alert"
            style={{ animation: "slideInRight 0.5s ease-out" }}
          >
            <div className="toast-header bg-success text-white">
              <i className="bi bi-check-circle-fill me-2"></i>
              <strong className="me-auto">{t("success.addedToCart")}</strong>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
            <div className="toast-body">
              <strong>{product.name}</strong> {t("productPage.addedToCartMsg")}
              <br />
              <small>{t("productPage.redirectingToCart")}</small>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductPage;
