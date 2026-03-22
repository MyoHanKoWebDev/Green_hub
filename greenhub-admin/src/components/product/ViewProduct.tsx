import React, { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import PageBreadcrumb from "../common/PageBreadCrumb";
import Button from "../ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table/index";
import TableSkeleton from "../common/TableSkeleton";
import { ConfirmModal } from "../common/ConfirmModalDelete";
import { useModal } from "../../hooks/useModal.js";
import { formatDate } from "../../utils/helper.js";
import ProductModal from "./ProductModal";
import DescriptionModal from "./DescriptionModal";
import axios from "../../../api/axios.js";
import { useDebounce } from "../../hooks/useDebounce";
import Alert from "../ui/alert/Alert.js";

interface ProductData {
  id: number;
  productName: string;
  description: string;
  price: number;
  stock_qty: number;
  image: string;
  ratings_avg_rating?: string | null;
  ratings_count?: number;
  created_at: string;
  eco_projects: any;
}

export default function ViewProduct() {
  const { isOpen, openModal, closeModal } = useModal();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals State
  const [isDescModalOpen, setIsDescModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    variant: "success" | "error";
    title: string;
    message: string;
  } | null>(null);
  // Selected Data
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(
    null,
  );
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [filterProjectId, setFilterProjectId] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  //Fetch projects for the filter dropdown
  useEffect(() => {
    axios.get("/admin/projects").then((res) => setProjects(res.data.data));
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/admin/products`, {
        params: {
          search: debouncedSearch,
          project_id: filterProjectId,
        },
      });
      if (res.data.status) {
        setProducts(res.data.data);
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setAlertConfig({
        variant: "error",
        title: "Fetch Error",
        message: axiosError.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, filterProjectId]);

  const openDeleteConfirm = (id: number) => {
    setItemToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const res = await axios.delete(`/admin/products/${itemToDelete}`);
      if (res.status === 200 || res.data.status) {
        toast.success(res.data.message, {
          duration: 4000,
          style: {
            borderRadius: "10px",
          },
        });
        setProducts((prev) => prev.filter((p) => p.id !== itemToDelete));
        setIsConfirmOpen(false);
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setAlertConfig({
        variant: "error",
        title: "Fetch Error",
        message: axiosError.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
      setIsConfirmOpen(false);
    }
  };

  useEffect(() => {
    if (alertConfig) {
      const timer = setTimeout(() => {
        setAlertConfig(null);
      }, 4000); // Hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [alertConfig]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <PageBreadcrumb pageTitle="Product Inventory" />

        <div className="flex flex-wrap items-center gap-3">
          {/* SEARCH INPUT */}
          <div className="relative">
            <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
              <svg
                className="fill-gray-500 dark:fill-gray-400"
                width="18"
                height="18"
                viewBox="0 0 20 20"
              >
                <path d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 xl:w-[250px]"
            />
          </div>

          {/* PROJECT FILTER DROPDOWN */}
          <select
            value={filterProjectId}
            onChange={(e) => setFilterProjectId(e.target.value)}
            className="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 min-w-[160px]"
          >
            <option value="" >All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>

          {/* RESET BUTTON: Only shows if search or filter is active */}
          {(searchTerm || filterProjectId) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterProjectId("");
              }}
              className="text-sm font-medium text-gray-500 hover:text-red-500 dark:text-gray-400 transition-colors"
            >
              Reset Filters
            </button>
          )}

          <div className="h-6 w-px bg-gray-200 dark:bg-white/10 mx-1 hidden sm:block" />

          {/* ADD PRODUCT BUTTON */}
          <Button
            onClick={() => {
              setSelectedProduct(null);
              openModal();
            }}
            size="sm"
            className="flex items-center gap-2 h-11 px-6 shadow-theme-xs"
          >
            <PlusIcon className="w-5 h-5" /> Add Product
          </Button>
        </div>
      </div>
      {alertConfig && <Alert {...alertConfig} />}

      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-5">
        <motion.div
          key="table"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full overflow-x-auto custom-scrollbar">
            <Table className="">
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start dark:text-gray-400"
                  >
                    Product
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start dark:text-gray-400"
                  >
                    Price
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start dark:text-gray-400"
                  >
                    Stock
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start dark:text-gray-400"
                  >
                    Description
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start dark:text-gray-400"
                  >
                    Project
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start dark:text-gray-400"
                  >
                    Created Date
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-end dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <AnimatePresence mode="wait">
                {loading ? (
                  <TableSkeleton key="skeleton" />
                ) : (
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {products.length > 0 ? (
                      products.map((product) => (
                        <TableRow key={product.id}>
                          {/* Product Info */}
                          <TableCell className="px-5 py-4 text-start">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-10 overflow-hidden rounded-md border border-gray-100 dark:border-gray-500">
                                <img
                                  src={`http://localhost:8000/uploads/admin/${product.image}`}
                                  className="w-full h-full object-cover "
                                  alt={product.productName}
                                />
                              </div>
                              <div>
                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                  {product.productName}
                                </span>
                              </div>
                            </div>
                          </TableCell>

                          {/* Price */}
                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            ${Number(product.price).toFixed(2)}
                          </TableCell>

                          {/* Stock Status */}
                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                product.stock_qty > 5
                                  ? "bg-green-50 text-green-700"
                                  : "bg-red-50 text-red-700"
                              }`}
                            >
                              {product.stock_qty} units
                            </span>
                          </TableCell>

                          {/* Description with "See More" */}
                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              {" "}
                              {/* Added gap-2 */}
                              <p className="truncate max-w-[150px]">
                                {product.description}
                              </p>
                              <button
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setIsDescModalOpen(true);
                                }}
                                className="text-brand-500 hover:text-brand-600 whitespace-nowrap font-medium"
                              >
                                see more
                              </button>
                            </div>
                          </TableCell>

                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {product?.eco_projects[0].title}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {formatDate(product.created_at)}
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="px-5 py-4 text-end">
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() => {
                                  setSelectedProduct(product);
                                  openModal();
                                }}
                                className="p-2 text-gray-500 hover:text-brand-500"
                              >
                                <PencilSquareIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openDeleteConfirm(product.id)}
                                className="p-2 text-gray-500 hover:text-red-600"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-10 text-gray-400"
                        >
                          No products found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                )}
              </AnimatePresence>
              
            </Table>
          </div>
        </motion.div>
      </div>

      {/* Logic for Add/Edit Modal */}
      <ProductModal
        isOpen={isOpen}
        onClose={closeModal}
        onSuccess={fetchProducts}
        selectedProduct={selectedProduct}
      />

      {/* Logic for Description Modal */}
      <DescriptionModal
        isOpen={isDescModalOpen}
        onClose={() => setIsDescModalOpen(false)}
        product={selectedProduct}
      />

      {/* Logic for Delete Confirmation */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title="Delete Product?"
        message={`Are you sure you want to delete "${products.find((p) => p.id === itemToDelete)?.productName}"?`}
      />
    </div>
  );
}
