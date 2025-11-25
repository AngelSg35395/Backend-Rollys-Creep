import supabase from '../config/supabase.js'
import { uploadImageFromUrl } from '../config/uploadImage.js'

export const getProductsType = async (req, res) => {
    // Get product type fetched from the URL
    const type = req.params.typePath

    // Prepare Query from Supabase
    let query = supabase.from('products').select('*').order('product_id')

    // Show InitialProducts
    if (type === 'initialProducts') {
        query = query.is('initially_show', true)
    }

    // Filter by product type
    if (type !== 'all' && type !== 'initialProducts') {
        query = query.eq('product_type', type)
    }

    // Get products
    const { data, error } = await query

    if (error) {
        console.log(error)
        res.status(500).json({ error: 'Error fetching products' + error })
    }
    res.json(data)
}

export const editProduct = async (req, res) => {
    const { id } = req.params
    const { image_url, name, description, price, product_type } = req.body

    try {
        // Verify if product exists
        const { data: productData, error: fetchError } = await supabase
            .from('products')
            .select('*')
            .eq('product_id', id)
            .single()

        if (fetchError) {
            console.log(error)
            res.status(500).json({ error: 'Error fetching product' + fetchError })
        }

        if (!productData) {
            res.status(404).json({ error: 'Product not found' })
        }

        let finalImageUrl = image_url

        // Verify if image_url changed
        if (productData.image_url !== image_url) {
            // Upload image
            const uploadedImageUrl = await uploadImageFromUrl(image_url)

            if (!uploadedImageUrl) {
                return res.status(500).json({ error: "Error uploading image" });
            }

            finalImageUrl = uploadedImageUrl
        }

        // Build product object
        const product = {
            name,
            description,
            price,
            product_type,
            product_sizes,
            image_url: finalImageUrl
        }

        // Update product
        const { data, error } = await supabase
            .from('products')
            .update(product)
            .eq('product_id', id)

        if (error) {
            console.log(error)
            res.status(500).json({ error: 'Error updating product' + error })
        }

        res.json({ message: 'Product updated successfully' })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Error updating product' + e })
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params

    // Delete product
    const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('product_id', id)

    if (error) {
        console.log(error)
        res.status(500).json({ error: 'Error deleting product' + error })
    }
    res.json({ message: 'Product deleted successfully'})
}

export const addProduct = async (req, res) => {
    try {
        const { image_url, name, description, price, product_type, product_sizes } = req.body;

        // Upload image
        const uploadedImageUrl = await uploadImageFromUrl(image_url);

        if (!uploadedImageUrl) {
            return res.status(500).json({ error: "Error uploading image" });
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
            console.log(error);
            return res.status(500).json({ error: 'Error adding product: ' + error.message });
        }

        res.status(201).json({ message: 'Product added successfully', product: data[0] });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error adding product: ' + (error.message || error) });
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
            console.log(error)
            res.status(500).json({ error: 'Error fetching product' + fetchError })
        }

        if (highlight && highlightedProducts.length >= 5) {
            return res.status(400).json({ error: 'El máximo de productos destacados (5) ha sido alcanzado' })
        }

        // Update product
        const { data, error } = await supabase
            .from('products')
            .update({ initially_show: highlight })
            .eq('product_id', id)
        
        if (error) {
            console.log(error)
            res.status(500).json({ error: 'Error updating product' + error })
        }
        res.json({ message: 'Product updated successfully' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Error updating product' + err })
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
            console.log(error)
            res.status(500).json({ error: 'Error fetching product' + error })
        }

        res.json(data)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error fetching product' + error })
    }
}