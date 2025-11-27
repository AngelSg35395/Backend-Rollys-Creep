import supabase from '../config/supabase.js'
import { uploadImageFromUrl } from '../config/uploadImage.js'

export const getProductsType = async (req, res) => {
    try {
        const type = req.params.typePath

        let query = supabase.from('products').select('*').order('product_id')

        if (type === 'initialProducts') {
            query = query.is('initially_show', true)
        }

        if (type !== 'all' && type !== 'initialProducts') {
            query = query.eq('product_type', type)
        }

        const { data, error } = await query

        if (error) {
            return res.status(500).json({
                error: 'Failed to fetch products',
                description: error.message,
            })
        }

        return res.json(data)
    } catch (err) {
        return res.status(500).json({
            error: 'Failed to fetch products',
            description: err.message,
        })
    }
}

export const editProduct = async (req, res) => {
    const { id } = req.params
    const { image_url, name, description, price, product_type, product_sizes } = req.body

    try {
        const { data: productData, error: fetchError } = await supabase
            .from('products')
            .select('*')
            .eq('product_id', id)
            .single()

        if (fetchError) {
            return res.status(500).json({
                error: 'Failed to fetch product',
                description: fetchError.message,
            })
        }

        if (!productData) {
            return res.status(404).json({ error: 'Product not found' })
        }

        let finalImageUrl = image_url

        if (productData.image_url !== image_url) {
            const uploadedImageUrl = await uploadImageFromUrl(image_url)

            if (!uploadedImageUrl) {
                return res.status(500).json({ error: "Failed to upload image" });
            }

            finalImageUrl = uploadedImageUrl
        }

        const product = {
            name,
            description,
            price,
            product_type,
            product_sizes,
            image_url: finalImageUrl
        }

        const { error } = await supabase
            .from('products')
            .update(product)
            .eq('product_id', id)

        if (error) {
            return res.status(500).json({
                error: 'Failed to update product',
                description: error.message,
            })
        }

        return res.json({ message: 'Product updated successfully' })
    } catch (e) {
        return res.status(500).json({
            error: 'Failed to update product',
            description: e.message,
        })
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params

    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('product_id', id)

        if (error) {
            return res.status(500).json({
                error: 'Failed to delete product',
                description: error.message,
            })
        }

        return res.json({ message: 'Product deleted successfully' })
    } catch (err) {
        return res.status(500).json({
            error: 'Failed to delete product',
            description: err.message,
        })
    }
}

export const addProduct = async (req, res) => {
    try {
        const { image_url, name, description, price, product_type, product_sizes } = req.body;

        // Upload image
        const uploadedImageUrl = await uploadImageFromUrl(image_url);

        if (!uploadedImageUrl) {
            return res.status(500).json({ error: "Failed to upload image" });
        }

        // Prepare product object
        const product = {
            name,
            description,
            price,
            product_type,
            product_sizes,
            image_url: uploadedImageUrl
        };

        const { data, error } = await supabase
            .from('products')
            .insert([product])
            .select();

        if (error) {
            return res.status(500).json({
                error: 'Failed to add product',
                description: error.message,
            });
        }

        return res.status(201).json({ message: 'Product added successfully', product: data[0] });
    } catch (error) {
        return res.status(500).json({
            error: 'Failed to add product',
            description: error.message || error,
        });
    }
}

export const HighlightProduct = async (req, res) => {
    const { id } = req.params
    const { highlight } = req.body

    try {
        // verify if highlight in db is <= 5
        const { data: highlightedProducts, error: fetchError } = await supabase
            .from('products')
            .select('*')
            .eq('initially_show', true)

        if (fetchError) {
            return res.status(500).json({
                error: 'Failed to fetch highlighted products',
                description: fetchError.message,
            })
        }

        const highlightedCount = highlightedProducts?.length ?? 0

        if (highlight && highlightedCount >= 5) {
            return res.status(400).json({ error: 'Maximum number of highlighted products (5) has been reached' })
        }

        // Update product
        const { data, error } = await supabase
            .from('products')
            .update({ initially_show: highlight })
            .eq('product_id', id)
        
        if (error) {
            return res.status(500).json({
                error: 'Failed to update product',
                description: error.message,
            })
        }
        return res.json({ message: 'Product updated successfully' })
    } catch (err) {
        return res.status(500).json({
            error: 'Failed to update product',
            description: err.message,
        })
    }
}

export const searchSizes = async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('products')
            .select('product_sizes')
            .eq('product_id', id)

        if (error) {
            return res.status(500).json({
                error: 'Failed to fetch product sizes',
                description: error.message,
            })
        }

        return res.json(data)
    } catch (error) {
        return res.status(500).json({
            error: 'Failed to fetch product sizes',
            description: error.message,
        })
    }
}