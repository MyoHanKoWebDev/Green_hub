import React, { useEffect, useState } from "react";
import { AxiosError } from "axios";
import axios from "../../../api/axios";
import { toast } from "react-hot-toast";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { PhotoIcon } from "@heroicons/react/24/outline";
import Alert from "../ui/alert/Alert";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedProduct: any | null;
}

export default function ProductModal({ isOpen, onClose, onSuccess, selectedProduct }: ProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]); // For the dropdown

  // Form States
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQty, setStockQty] = useState("");
  const [projectId, setProjectId] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [alertConfig, setAlertConfig] = useState<{
      variant: "error";
      title: string;
      message: string;
    } | null>(null);
  

  // 1. Fetch projects for the dropdown when modal opens
  useEffect(() => {
    if (isOpen) {
      axios.get("/admin/projects").then((res) => setProjects(res.data.data));
    }
  }, [isOpen]);

  // 2. Sync form with selectedProduct (Edit mode)
  useEffect(() => {
    if (selectedProduct) {
      setProductName(selectedProduct.productName);
      setDescription(selectedProduct.description);
      setPrice(selectedProduct.price.toString());
      setStockQty(selectedProduct.stock_qty.toString());
      // Get ID from the eco_projects relationship
      setProjectId(selectedProduct.eco_projects?.[0]?.id?.toString() || "");
      setImagePreview(`http://localhost:8000/uploads/admin/${selectedProduct.image}`);
    } else {
      setProductName("");
      setDescription("");
      setPrice("");
      setStockQty("");
      setProjectId("");
      setImagePreview(null);
    }
    setImageFile(null);
    setAlertConfig(null);
  }, [selectedProduct, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock_qty", stockQty);
    formData.append("project_id", projectId);
    if (imageFile) formData.append("image", imageFile);
    
    // Laravel PUT workaround for FormData
    if (selectedProduct) formData.append("_method", "PUT");

    try {
      const url = selectedProduct ? `/admin/products/${selectedProduct.id}` : "/admin/products";
      const res = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.status) {
        toast.success(res.data.message);
        onSuccess();
        onClose();
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string; errors?: Record<string, string[]> }>;
            const validationErrors = axiosError.response?.data?.errors;
            let displayMessage = axiosError.response?.data?.message || "Something went wrong";
      
            if (validationErrors) {
              displayMessage = Object.values(validationErrors)[0][0];
            }
      
            setAlertConfig({ variant: "error", title: "Action Failed", message: displayMessage });
    } finally {
      setLoading(false);
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
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] m-4">
      <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900 lg:p-10">
         <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {selectedProduct ? "Edit" : "Add"} Product
        </h4>
        {alertConfig && <Alert {...alertConfig} />}


        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-6">
          {/* Product Name */}
          <div>
            <Label>Product Name</Label>
            <Input value={productName} onChange={(e) => setProductName(e.target.value)} required />
          </div>

          {/* Project Selection Dropdown */}
          <div>
            <Label>Link to Project</Label>
            <select 
              className="w-full h-11 px-3 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
            >
              <option value="">Select a Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          {/* Price & Stock in one row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Price ($)</Label>
              <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div>
              <Label>Stock Qty</Label>
              <Input type="number" value={stockQty} onChange={(e) => setStockQty(e.target.value)} required />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <textarea 
              className="w-full p-3 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label>Product Image</Label>
            <label className={`mt-2 flex items-center ${imagePreview && "px-20 "} justify-center$ w-full h-36 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5`}>
              <div className="text-center w-full">
                <PhotoIcon className={`mx-auto h-6 w-6 text-gray-400 ${imagePreview  ? "hidden" : "block"}`}/>
                <span className="text-xs text-gray-500 object-cover">
                  {imagePreview ?  
                    (
                        <div className="w-full">
                <img src={imagePreview} alt="Preview" className="w-full h-36 rounded-lg border " />
              </div>
                    )
                  : "Select image (JPG, PNG)"}
                </span>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} required={!selectedProduct} />
            </label>
          </div>
        

        <div className="flex gap-3 pt-4">
          <Button size="sm" variant="outline" className="flex-1" onClick={onClose} disabled={loading} type="button">Cancel</Button>
          <Button size="sm" type="submit" className="flex-1" disabled={loading}>
            {loading ? "Processing..." : selectedProduct ? "Update Product" : "Save Product"}
          </Button>
        </div>
        </form>
      </div>
    </Modal>
  );
}