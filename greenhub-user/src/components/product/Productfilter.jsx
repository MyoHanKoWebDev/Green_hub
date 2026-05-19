import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/20/solid";
import Productlist from "./Productlist";
import Shoppingcart from "./Shoppingcart";
import { FilterSection, PriceFilter } from "./FilterSection";
import axios from "../../../api/axios";
import { ProductCardSkeleton } from "../skeleton/ProductCardSkeleton";
import { useCart } from "../../context/CartContext";
import { useLocation } from "react-router-dom";

const Productfilter = () => {
  const { cartItems } = useCart();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [projectId, setProjectId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [errors, setErrors] = useState("");
  const location = useLocation();
  const [projectTypes, setProjectTypes] = useState([]);
  const [projectTypeId, setProjectTypeId] = useState([]);

  useEffect(() => {
    axios.get("api/admin/types").then((res) => setProjectTypes(res.data.data));
  }, []);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const dynamicFilters = [
    {
      id: "project",
      name: "Eco Projects",
      options: projectTypes.map((type) => ({
        value: type.id, // Send this to backend
        label: type.typeName, // Show this in UI (from your ProjectType model)
      })),
    },
  ];

  const loadData = async () => {
    setLoading(true);
    setErrors("");
    try {
      const response = await axios.get("api/admin/products", {
        params: {
          page: currentPage,
          search: search,
          project_type_id: projectTypeId,
          min_price: priceRange.min,
          max_price: priceRange.max,
          sort: sortBy,
          per_page: 6,
        },
      });

      if (response.status) {
        setProducts(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearAllFilters = () => {
    setSearch("");
    setProjectTypeId([]);
    setPriceRange({ min: "", max: "" });
    setSortBy("newest");
    setCurrentPage(1);
  };

  const isFiltered =
    search !== "" ||
    (projectTypeId && projectTypeId.length > 0) ||
    (priceRange.min !== "" && priceRange.min !== null) ||
    (priceRange.max !== "" && priceRange.max !== null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadData();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [
    search,
    projectTypeId,
    priceRange.min,
    priceRange.max,
    currentPage,
    sortBy,
    location.state,
  ]);

  return (
    <div className="bg-white">
      {/* Mobile Filters */}
      <Dialog
        open={mobileFiltersOpen}
        onClose={setMobileFiltersOpen}
        className="relative z-40 lg:hidden"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/25 transition-opacity" />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel className="relative ml-auto flex size-full max-w-xs flex-col bg-white py-4 shadow-xl">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-lg font-medium">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <XMarkIcon className="size-6 text-gray-400" />
              </button>
            </div>
            <form className="mt-6 border-t border-gray-200">
              {dynamicFilters.map((s) => (
                <FilterSection
                  key={s.id}
                  section={s}
                  selectedId={projectTypeId || []}
                  onSelect={(id) => {
                    setProjectTypeId((prev) => {
                      // 1. Ensure prev is treated as an array (fallback to [] if null)
                      const currentSelected = Array.isArray(prev) ? prev : [];

                      // 2. Toggle logic
                      if (currentSelected.includes(id)) {
                        // Remove the id if it's already there
                        return currentSelected.filter((item) => item !== id);
                      } else {
                        // Add the id if it's not there
                        return [...currentSelected, id];
                      }
                    });
                    setCurrentPage(1);
                  }}
                  isMobile
                />
              ))}

              <PriceFilter
                isMobile
                initialValues={priceRange}
                onApply={(newMin, newMax) => {
                  // Spread the values to ensure React sees a fresh object
                  setPriceRange({ min: newMin, max: newMax });
                  setCurrentPage(1);
                }}
              />
            </form>
          </DialogPanel>
        </div>
      </Dialog>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {errors && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            {errors}
          </div>
        )}
        <div className="border-b border-gray-300 pt-10 pb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Eco-Friendly Products</h1>

            <div className="flex flex-col">
              <div className="flex flex-1 items-center gap-4 justify-end">
                {/* Desktop Sort Menu */}

                <Menu as="div" className="relative">
                  <MenuButton className="text-sm font-medium text-gray-700 flex items-center">
                    Sort: {sortBy === "newest" ? "Newest" : "Most Popular"}
                    <ChevronDownIcon className="ml-1 h-5 w-5" />
                  </MenuButton>

                  <MenuItems className="absolute left-0 lg:-left-16 z-10 mt-2 w-40 rounded-md bg-white shadow-2xl ring-1 ring-black/5">
                    <MenuItem>
                      <button
                        onClick={() => {
                          setSortBy("newest");
                          setCurrentPage(1);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${sortBy === "newest" ? "bg-gray-100 font-bold" : ""}`}
                      >
                        Newest
                      </button>
                    </MenuItem>

                    <MenuItem>
                      <button
                        onClick={() => {
                          setSortBy("popular");
                          setCurrentPage(1);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${sortBy === "popular" ? "bg-gray-100 font-bold" : ""}`}
                      >
                        Most Popular
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
                <button
                  onClick={() => setCartOpen(true)}
                  className="text-gray-400 hover:text-lime-600 relative"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-[10px] text-white rounded-full px-1.5">
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* Icons group for mobile only */}
                <div className="flex items-center gap-3 lg:hidden">
                  <button onClick={() => setMobileFiltersOpen(true)}>
                    <FunnelIcon className="h-6 w-6 text-gray-400" />
                  </button>
                </div>

                {/* Search Box - Full width on mobile, fixed width on desktop */}
                <div className="relative w-full lg:w-60">
                  <input
                    type="text"
                    value={search}
                    placeholder="Search products..."
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="block w-full rounded-2xl border border-gray-300 bg-gray-50 py-2.5 px-4 pr-10 text-sm focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none"
                  />
                  <MagnifyingGlassIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              {/* Active Filter Tags */}
              {isFiltered && (
                <div className="mt-4 flex flex-wrap items-center gap-2 ">
                  {/* Search Tag */}
                  {search && (
                    <span className="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 shadow-sm">
                      Search: {search}
                      <button
                        onClick={() => setSearch("")}
                        className="hover:text-red-500"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  )}

                  {/* Project Tag */}
                  {/* Check if the array has any selected IDs */}
                  {projectTypeId &&
                    projectTypeId.length > 0 &&
                    projectTypeId.map((selectedId) => {
                      // Find the project type details for this specific ID
                      const type = projectTypes.find(
                        (p) => p.id === selectedId,
                      );

                      // If the type isn't loaded yet, don't show anything for this specific badge
                      if (!type) return null;

                      return (
                        <span
                          key={selectedId}
                          className="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 shadow-sm"
                        >
                          {type.typeName}
                          <button
                            onClick={() => {
                              // Remove ONLY this ID from the array when the X is clicked
                              setProjectTypeId((prev) =>
                                prev.filter((id) => id !== selectedId),
                              );
                            }}
                            className="hover:text-red-500 transition-colors"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </span>
                      );
                    })}

                  {/* Price Tag */}
                  {(priceRange.min || priceRange.max) && (
                    <span className="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 shadow-sm">
                      Price: ${priceRange.min || 0} - ${priceRange.max || "∞"}
                      <button
                        onClick={() => setPriceRange({ min: "", max: "" })}
                        className="hover:text-red-500"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  )}

                  {/* Clear All Button */}
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-bold text-lime-500 hover:text-lime-600 ml-2 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="pt-6 pb-24 grid grid-cols-1 lg:grid-cols-5 gap-x-8">
          <form className="hidden lg:block">
            {dynamicFilters.map((s) => (
              <FilterSection
                key={s.id}
                section={s}
                selectedId={projectTypeId || []}
                onSelect={(id) => {
                  setProjectTypeId((prev) => {
                    // 1. Ensure prev is treated as an array (fallback to [] if null)
                    const currentSelected = Array.isArray(prev) ? prev : [];

                    // 2. Toggle logic
                    if (currentSelected.includes(id)) {
                      // Remove the id if it's already there
                      return currentSelected.filter((item) => item !== id);
                    } else {
                      // Add the id if it's not there
                      return [...currentSelected, id];
                    }
                  });
                  setCurrentPage(1);
                }}
              />
            ))}

            <PriceFilter
              initialValues={priceRange}
              onApply={(newMin, newMax) => {
                // Spread the values to ensure React sees a fresh object
                setPriceRange({ min: newMin, max: newMax });
                setCurrentPage(1);
              }}
            />
          </form>
          <div className="lg:col-span-4">
            {loading ? (
              /* Render 8 skeletons (matching your per_page count) */
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <Productlist
                products={products}
                pagination={pagination}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </div>
        </section>
      </main>
      <Shoppingcart open={cartOpen} setOpen={setCartOpen} />
    </div>
  );
};

export default Productfilter;
