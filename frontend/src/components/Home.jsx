import { useEffect } from "react";
import { useGetProductsQuery } from "../redux/api/productApi";
import Loader from "./layout/Loader";
import MetaData from "./layout/MetaData";
import ProductItem from "./product/ProductItem";
import toast from "react-hot-toast";
import CustomPagination from "./layout/CustomPagination";
import { useSearchParams } from "react-router-dom";
import Filters from "./layout/Filters";

const Home = () => {
  const [searchParams] = useSearchParams();

  const page = searchParams.get("page") || 1;
  const keyword = searchParams.get("keyword") || "";

  const params = { page, keyword };

  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const category = searchParams.get("category");
  const ratings = searchParams.get("ratings");

  min !== null && (params.min = min);
  max !== null && (params.max = max);
  category !== null && (params.category = category);
  ratings !== null && (params.ratings = ratings);

  const { data, isLoading, error, isError } = useGetProductsQuery(params);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError]);

  if (isLoading) return <Loader />;

  const columnSize = keyword ? 4 : 3;

  return (
    <>
      <MetaData title={"One Stop Shop For All things"} />
      <div className="container">
        <div className="row">
          {keyword && (
            <div className="col-6 col-md-3 mt-5">
              <Filters />
            </div>
          )}
          <div className={keyword ? "col-6 col-md-9" : "col-6 col-md-12"}>
            <h1 id="products_heading" className="text-secondary">
              {keyword
                ? `${data?.products?.length} Products Found With Keyword: ${keyword}`
                : "Latest Products"}
            </h1>

            <section id="products" className="mt-5">
              <div className="row">
                {data?.products?.map((product) => (
                  <ProductItem product={product} columnSize={columnSize} />
                ))}
              </div>
            </section>
          </div>
        </div>
        <CustomPagination
          resPerPage={data?.resPerPage}
          filteredProductsCount={data?.filteredProductsCount}
        />
      </div>
    </>
  );
};

export default Home;
