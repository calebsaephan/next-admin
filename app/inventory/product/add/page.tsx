import ProductForm from "../../components/ProductForm"

export default async function ProductDetailPage() {
    return (
        <div className="max-w-4xl mx-auto p-6 flex flex-col gap-4">
            <h3>Add New Product</h3>
            <ProductForm product={null} />
        </div>
    )
}
