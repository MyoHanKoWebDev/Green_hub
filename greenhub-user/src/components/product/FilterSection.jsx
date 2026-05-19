import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { PlusIcon, MinusIcon } from "@heroicons/react/20/solid";
import { useEffect, useState} from "react";

export const FilterSection = ({ section, isMobile = false, selectedId , onSelect }) => {
  const safeSelectedIds = Array.isArray(selectedId) ? selectedId : [];
  return  (
  <Disclosure as="div" className={`border-b border-gray-200 py-6 ${isMobile ? "px-4" : ""}`}>
    <h3 className="-my-3 flow-root">
      <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
        <span className="font-medium text-gray-900">{section.name}</span>
        <span className="ml-6 flex items-center">
          <PlusIcon className="size-5 group-data-open:hidden" />
          <MinusIcon className="size-5 group-not-data-open:hidden" />
        </span>
      </DisclosureButton>
    </h3>
    <DisclosurePanel transition className="pt-6 transition duration-200 ease-out data-closed:-translate-y-2 data-closed:opacity-0">
      <div className="space-y-4">
        {section.options.map((option) => (
          <div key={option.value} className="flex gap-3">
            <input
              id={`filter-${option.value}`}
              type="checkbox"
              checked={safeSelectedIds.includes(option.value)}
              onChange={() => onSelect(option.value)}
              className="size-4 rounded border-gray-300 text-lime-600 focus:ring-lime-500"
            />  
            <label htmlFor={`filter-${option.value}`} className="text-sm text-gray-600 cursor-pointer">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </DisclosurePanel>
  </Disclosure>
);
}

export const PriceFilter = ({ isMobile = false, onApply, initialValues }) => {
  const [min, setMin] = useState(initialValues.min || "");
  const [max, setMax] = useState(initialValues.max || "");

  useEffect(() => {
    setMin(initialValues.min || "");
    setMax(initialValues.max || "");
  }, [initialValues.min, initialValues.max]);

  const handleApply = (e) => {
    e.preventDefault();
    // Convert to numbers or null before sending to parent
    const finalMin = min === "" ? "" : Math.floor(Number(min));
    const finalMax = max === "" ? "" : Math.floor(Number(max));
    onApply(finalMin, finalMax);
  };

  // Block '-', '+', 'e', and '.' (decimals)
  const blockInvalidChar = (e) => {
    if (["-", "+", "e", "."].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <Disclosure as="div" className={`border-b border-gray-200 py-6 ${isMobile ? "px-4" : ""}`}>
      <h3 className="-my-3 flow-root">
        <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
          <span className="font-medium text-gray-900">Price Range</span>
          <span className="ml-6 flex items-center">
            <PlusIcon className="size-5 group-data-open:hidden" />
            <MinusIcon className="size-5 group-not-data-open:hidden" />
          </span>
        </DisclosureButton>
      </h3>
      <DisclosurePanel className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2 text-gray-400 text-xs">$</span>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="Min"
                value={min}
                onKeyDown={blockInvalidChar}
                onChange={(e) => setMin(e.target.value)} // Back to simple change
                className="w-full rounded-md border-gray-300 pl-6 py-2 text-sm focus:ring-lime-500 outline-none"
              />
            </div>
            <div className="relative flex-1">
              <span className="absolute left-3 top-2 text-gray-400 text-xs">$</span>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="Max"
                value={max}
                onKeyDown={blockInvalidChar}
                onChange={(e) => setMax(e.target.value)} // Back to simple change
                className="w-full rounded-md border-gray-300 pl-6 py-2 text-sm focus:ring-lime-500 outline-none"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleApply}
            className="w-full bg-lime-500 hover:bg-lime-600 text-white text-xs font-bold py-2.5 rounded-md transition-all active:scale-95"
          >
            Apply Price
          </button>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};