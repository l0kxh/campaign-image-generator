import { useState, useEffect } from "react";
import { Camera, Image, Sparkles, Zap, Palette, Layers, Monitor, Download, ChevronDown, ChevronUp, LoaderCircle, Copy, Upload, X, XCircle } from "lucide-react";
import "./EmailImageGen.css";

export default function EmailImageGen() {
    // State for form inputs
    const [campaignName, setCampaignName] = useState("");
    const [coreMessage, setCoreMessage] = useState("");
    const [campaignDescription, setCampaignDescription] = useState("");
    const [imageHeight, setImageHeight] = useState("");
    const [imageWidth, setImageWidth] = useState("");
    const [generating, setGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [imageGenerated, setImageGenerated] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState("modern");
    const [apiKey, setApiKey] = useState("AIzaSyALcXFHOnCQfq8R6zyPd6yWqTXepoa5Wz4");
    const [openCampaignDetails, setOpenCampaignDetails] = useState(false);
    const [openBrandSettings, setOpenBrandSettings] = useState(false);
    const [openVisualContent, setVisualContent] = useState(false);
    const [uploadedImageBase64, setUploadedImageBase64] = useState(null);

    // Visual content configuration
    const [visualConfig, setVisualConfig] = useState({
        imageStyle: "product-focused",
        visualElements: ["product", "people", "text-overlay"],
        mood: "vibrant",
        imagePrompt: "",
        height: 1200,
        width: 628
    });

    // Brand configuration state
    const [brandConfig, setBrandConfig] = useState({
        primaryColor: "#0066cc",
        secondaryColor: "#ff9900",
        accentColor: "#66cc99",
        font: "Arial, sans-serif",
        logoPosition: "top-left",
        style: "modern",
    });

    // Demo brand presets
    const brandPresets = [
        { name: "Professional Blue", primaryColor: "#0066cc", secondaryColor: "#ff9900", accentColor: "#66cc99", style: "modern" },
        { name: "Elegant Black", primaryColor: "#000000", secondaryColor: "#f5f5f5", accentColor: "#d4af37", style: "minimal" },
        { name: "Vibrant Red", primaryColor: "#cc0000", secondaryColor: "#ffcc00", accentColor: "#ff6600", style: "bold" },
        { name: "Eco Green", primaryColor: "#006633", secondaryColor: "#99cc33", accentColor: "#ccff99", style: "organic" },
        { name: "Tech Purple", primaryColor: "#6600cc", secondaryColor: "#cc99ff", accentColor: "#00ccff", style: "modern" },
    ];

    // Email template styles
    const templateStyles = [
        { id: "modern", name: "Modern", description: "Clean layout with balanced visuals and text" },
        { id: "minimal", name: "Minimal", description: "Simple design that emphasizes a single focal point" },
        { id: "bold", name: "Bold", description: "High contrast, eye-catching elements" },
        { id: "lifestyle", name: "Lifestyle", description: "People-focused imagery that connects emotionally" },
        { id: "product", name: "Product Showcase", description: "Highlights product details with clean backgrounds" },
    ];

    // Visual image style examples
    const imageStyles = [
        { id: "product-focused", name: "Product Focus", icon: <Monitor size={20} /> },
        { id: "lifestyle", name: "Lifestyle", icon: <Image size={20} /> },
        { id: "abstract", name: "Abstract", icon: <Layers size={20} /> },
        { id: "seasonal", name: "Seasonal", icon: <Palette size={20} /> },
    ];

    // Function to generate visual content prompt based on form inputs
    // const generateVisualPrompt = () => {
    //     //     const prompt = `Create a professional email marketing ${visualConfig.imageStyle} image for ${campaignName} campaign. 
    //     // Main message: "${coreMessage}". 
    //     // Style: ${brandConfig.style}, Mood: ${visualConfig.mood}. 
    //     // Use brand colors: ${brandConfig.primaryColor}, ${brandConfig.secondaryColor}, and ${brandConfig.accentColor}.
    //     // Include visual elements: ${visualConfig.visualElements.join(", ")}.`;
    //     const prompt = `Generate a professional email marketing image for the "${campaignName}" campaign. Rewrite the following campaign description into a concise, engaging marketing message suitable for the image: "${campaignDescription}" Design Style: ${visualConfig.imageStyle} Mood: ${visualConfig.mood} Design Approach: ${brandConfig.style} Use brand colors: ${brandConfig.primaryColor}, ${brandConfig.secondaryColor}, and ${brandConfig.accentColor} to maintain visual identity. Include these visual elements: ${visualConfig.visualElements.join(", ")}.Final image dimensions should be ${visualConfig.width}px width by ${visualConfig.height}px height, optimized for email layout. Make sure the image is visually appealing, modern, and aligned with email marketing standards.`;

    //     setVisualConfig({ ...visualConfig, imagePrompt: prompt });
    //     return prompt;
    // };


    // const generateVisualPrompt = () => {
    //     // Get current dimensions (either from user input or defaults)
    //     const currentWidth = imageWidth ? parseInt(imageWidth) : visualConfig.width;
    //     const currentHeight = imageHeight ? parseInt(imageHeight) : visualConfig.height;

    //     let prompt = `Create a professional email marketing image with the following specifications:
    

    // - Campaign Name: "${campaignName}"
    // - Campaign Subject: "${coreMessage}"
    // - Campaign Description: "${campaignDescription}"
    
    // DESIGN REQUIREMENTS:
    // - Image Style: ${visualConfig.imageStyle}
    // - Visual Mood: ${visualConfig.mood}
    // - Design Approach: ${brandConfig.style}
    // - Final Dimensions: ${currentWidth}px width × ${currentHeight}px height
    
    // BRAND IDENTITY:
    // - Primary Brand Color: ${brandConfig.primaryColor}
    // - Secondary Brand Color: ${brandConfig.secondaryColor}
    // - Accent Color: ${brandConfig.accentColor}
    // - These colors should be prominently used throughout the design
    
    // VISUAL ELEMENTS TO INCLUDE:
    // ${visualConfig.visualElements.map(element => `- ${element.replace('-', ' ').toUpperCase()}`).join('\n')}
    
    // CONTENT INTEGRATION:
    // - Rewrite the campaign subject with powerful, attention-grabbing language using marketing psychology
    // -Transform the description into persuasive copy rather than using it as-is
    // -Enhance both texts with proven marketing techniques like power words, action verbs, and emotional triggers
    // -Create urgency and scarcity elements to drive immediate action
    // -Include compelling CTAs that motivate responsen
    
    // TECHNICAL SPECIFICATIONS:
    // - Optimize for email marketing standards
    // - Ensure responsive design compatibility
    // - Use high contrast for text readability
    // - Modern, clean aesthetic aligned with ${brandConfig.style} style`;

    //     // Add logo integration instructions if image is uploaded
    //     if (uploadedImageBase64) {
    //         prompt += `
    
    // LOGO INTEGRATION:
    // - The uploaded image contains the brand logo
    // - Integrate this logo seamlessly into the email design
    // - Position the logo in the ${brandConfig.logoPosition || 'top-left'} area
    // - DO NOT modify, alter, or redesign the logo - use it exactly as provided
    // - Ensure the logo is clearly visible but proportionally sized (typically 10-15% of total image width)
    // - The logo should complement the overall design without overwhelming other elements
    // - Maintain the logo's original colors and proportions
    // - Place the logo on a clean background area for maximum visibility
    // - If the logo has transparency, preserve it`;
    //     }

    //     prompt += `
    
    // LAYOUT GUIDELINES:
    // - Use a clear visual hierarchy with the campaign subject as the primary focus
    // - Balance text and visual elements effectively
    // - Ensure adequate white space for a clean, professional look
    // - Make the call-to-action elements stand out using the accent color
    // - Optimize text size for email readability (minimum 14px equivalent)
    
    // FINAL OUTPUT:
    // Create a visually striking, professional email marketing image that combines all these elements harmoniously. The result should be modern, engaging, and ready for immediate use in email campaigns with the provided image final dimensions.`;

    //     // Update visual config with current prompt and dimensions
    //     setVisualConfig({
    //         ...visualConfig,
    //         imagePrompt: prompt,
    //         width: currentWidth,
    //         height: currentHeight
    //     });
    //     console.log(prompt)
    //     return prompt;
    // };

    const generateVisualPrompt = () => {
        // Get current dimensions (either from user input or defaults)
        const currentWidth = imageWidth ? parseInt(imageWidth) : visualConfig.width;
        const currentHeight = imageHeight ? parseInt(imageHeight) : visualConfig.height;
    
        let prompt = `Create a professional email marketing image with the following specifications:
    
        - Campaign Theme: "${campaignName}"
        - Key Message: "${coreMessage}"
        - Campaign Context: Use "${campaignDescription}" as inspiration for visual elements and theme only - DO NOT include this text in the image
        
        DESIGN REQUIREMENTS:
        - Image Style: ${visualConfig.imageStyle}
        - Visual Mood: ${visualConfig.mood}
        - Design Approach: ${brandConfig.style}
        - Final Dimensions: ${currentWidth}px width × ${currentHeight}px height
        - PRIORITY: 70% visual elements, 30% text maximum
        
        BRAND IDENTITY:
        - Primary Brand Color: ${brandConfig.primaryColor}
        - Secondary Brand Color: ${brandConfig.secondaryColor}
        - Accent Color: ${brandConfig.accentColor}
        - These colors should be prominently used throughout the design
        
        VISUAL ELEMENTS TO INCLUDE:
        ${visualConfig.visualElements.map(element => `- ${element.replace('-', ' ').toUpperCase()}`).join('\n')}
        
        TEXT CONTENT RULES (CRITICAL):
        - Include ONLY a short, punchy headline (maximum 5-8 words)
        - Transform the core message into a compelling tagline or headline
        - NO paragraph text or detailed descriptions
        - Include ONE clear, short CTA button (2-3 words max like "Shop Now", "Get Started", "Learn More")
        - Use the campaign description ONLY as thematic inspiration - do NOT display it as text
        - Focus on creating powerful visual storytelling rather than text explanation
        
        VISUAL COMPOSITION:
        - Make visuals the hero of the design
        - Use imagery, graphics, and design elements to convey the campaign message
        - Create visual interest through colors, shapes, and graphic elements
        - Let the visuals tell the story, not the text
        - Ensure the design works even if someone just glances at it for 2 seconds
        
        TECHNICAL SPECIFICATIONS:
        - Optimize for email marketing standards
        - Ensure responsive design compatibility
        - Use high contrast for minimal text elements
        - Modern, clean aesthetic aligned with ${brandConfig.style} style
        - Text should be easily readable but not dominate the design`;
    
        // Add logo integration instructions if image is uploaded
        if (uploadedImageBase64) {
            prompt += `
        
        LOGO INTEGRATION:
        - The uploaded image contains the brand logo
        - Integrate this logo seamlessly into the email design
        - Position the logo in the ${brandConfig.logoPosition || 'top-left'} area
        - DO NOT modify, alter, or redesign the logo - use it exactly as provided
        - Size the logo proportionally (typically 8-12% of total image width)
        - The logo should complement the overall design without overwhelming other elements
        - Maintain the logo's original colors and proportions
        - Place the logo on a clean background area for maximum visibility`;
        }
    
        prompt += `
        
        LAYOUT GUIDELINES:
        - Create a strong visual focal point that isn't text-based
        - Use visual hierarchy through design elements, not text size
        - Maintain generous white space
        - Make the CTA button visually prominent using the accent color
        - Ensure any text is integrated into the design, not just placed on top
        
        FINAL OUTPUT:
        Create a visually striking, image-focused email marketing design that tells a story through visuals. The design should be instantly engaging and communicate the campaign's essence through graphic elements, colors, and minimal impactful text. Think more like a magazine ad or poster than a text-heavy flyer.`;
    
        // Update visual config with current prompt and dimensions
        setVisualConfig({
            ...visualConfig,
            imagePrompt: prompt,
            width: currentWidth,
            height: currentHeight
        });
        console.log(prompt);
        return prompt;
    };

    // Function to generate AI image using Google's Imagen API
    const generateImage = async () => {
        if (!campaignName || !coreMessage || !campaignDescription) {
            alert("Please fill in campaign name,campaign subject and campaign description.");
            return;
        }

        setGenerating(true);
        const visualPrompt = generateVisualPrompt();

        try {
            // Call Gemini AI  API
            const response = await generateImageWithGemini(visualPrompt);

            if (response && response.image) {
                setGeneratedImage({
                    url: response.image,
                    campaignName,
                    coreMessage,
                    visualPrompt,
                    ...brandConfig,
                    ...visualConfig
                });
                setImageGenerated(true);
            } else {
                alert("Failed to generate image. Please check your API key and try again.");
            }
        } catch (error) {
            console.error("Error generating image:", error);
            alert(`Error generating image: ${error.message}`);
        } finally {
            setGenerating(false);
        }
    };

    // Function to call Gemini's API
    const generateImageWithGemini = async (prompt) => {
        // The URL for Gemini image generation API
        const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent";

        const parts = [{ text: prompt }];

        if (uploadedImageBase64) {
            parts.push({
                inlineData: {
                    mimeType: "image/png", // or derive from uploaded file
                    data: uploadedImageBase64
                }
            });
        }
        // Request body for Gemini
        const requestBody = {
            contents: [{ parts }],
            generationConfig: {
                responseModalities: ["TEXT", "IMAGE"]
            }
        };

        try {
            const response = await fetch(`${endpoint}?key=${apiKey}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API request failed: ${errorText}`);
            }

            const data = await response.json();

            // Extract the image data from the response
            let imageBase64 = null;

            if (data?.candidates?.[0]?.content?.parts) {
                const imagePart = data.candidates[0].content.parts.find(part => part.inlineData?.mimeType?.startsWith('image/'));
                if (imagePart?.inlineData?.data) {
                    imageBase64 = imagePart.inlineData.data;
                }
            }

            if (imageBase64) {
                return {
                    image: `data:image/png;base64,${imageBase64}`,
                };
            } else {
                throw new Error("No image data received");
            }
        } catch (error) {
            console.error("API error:", error);
            throw error;
        }
    };

    // Apply a brand preset
    const applyBrandPreset = (preset) => {
        setBrandConfig({
            ...brandConfig,
            primaryColor: preset.primaryColor,
            secondaryColor: preset.secondaryColor,
            accentColor: preset.accentColor,
            style: preset.style
        });
    };

    // Handle download
    const handleDownload = () => {
        if (!generatedImage || !generatedImage.url) {
            alert("No image available to download.");
            return;
        }

        // For base64 images
        if (generatedImage.url.startsWith('data:')) {
            const link = document.createElement('a');
            link.href = generatedImage.url;
            link.download = `${campaignName.replace(/\s+/g, '-').toLowerCase()}-email-visual.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        // For URL images
        else {
            fetch(generatedImage.url)
                .then(response => response.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${campaignName.replace(/\s+/g, '-').toLowerCase()}-email-visual.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error("Download error:", error);
                    alert("Failed to download the image.");
                });
        }
    };


    //Handle copy
    const handleCopy = async () => {
        if (!generatedImage || !generatedImage.url) {
            alert("No image available to copy.");
            return;
        }

        try {
            // Fetch image as a Blob
            const response = await fetch(generatedImage.url);
            const blob = await response.blob();

            // Create a ClipboardItem
            const clipboardItem = new ClipboardItem({ [blob.type]: blob });

            // Write the image blob to clipboard
            await navigator.clipboard.write([clipboardItem]);

            alert("Image copied to clipboard!");
        } catch (error) {
            console.error("Failed to copy image:", error);
            alert("Failed to copy image. Make sure you're using a supported browser.");
        }
    };


    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Optional: check if it's an image
        if (!file.type.startsWith('image/')) {
            alert('Please upload a valid image file.');
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];
            setUploadedImageBase64(base64String);
            alert('Image uploaded!');
        };

        reader.onerror = () => {
            console.error("Error reading file:", reader.error);
            alert('Failed to read the file!');
        };

        reader.readAsDataURL(file);
    };


    // Update selected visual elements
    const toggleVisualElement = (element) => {
        if (visualConfig.visualElements.includes(element)) {
            setVisualConfig({
                ...visualConfig,
                visualElements: visualConfig.visualElements.filter(item => item !== element)
            });
        } else {
            setVisualConfig({
                ...visualConfig,
                visualElements: [...visualConfig.visualElements, element]
            });
        }
    };

    const handleRemoveImage = () => {
        setUploadedImageBase64(null);
    };

    return (
        <div className="app-container">
            <main className="main-content">
                {/* Configuration panel */}
                <div className="config-panel">
                    <div className="section-header">
                        <div className="section-title">
                            <Sparkles size={20} className="icon blue" />
                            <h2>Campaign Details</h2>
                        </div>
                        <div className="chevron-style" onClick={() => setOpenCampaignDetails(!openCampaignDetails)}>
                            {openCampaignDetails ? <ChevronUp /> : <ChevronDown />}
                        </div>
                    </div>
                    {openCampaignDetails && (
                        <>
                            <div className="form-group">
                                <label className="form-label">Campaign Name</label>
                                <input
                                    type="text"
                                    value={campaignName}
                                    onChange={(e) => setCampaignName(e.target.value)}
                                    className="form-input"
                                    placeholder="Enter campaign name"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Core Message</label>
                                <textarea
                                    value={coreMessage}
                                    onChange={(e) => setCoreMessage(e.target.value)}
                                    className="form-textarea"
                                    placeholder="Enter campaign subject"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    value={campaignDescription}
                                    onChange={(e) => setCampaignDescription(e.target.value)}
                                    className="form-textarea"
                                    placeholder="Enter campaign description"
                                />
                            </div>
                        </>)}

                    <div className="section-header">
                        <div className="section-title">
                            <Palette size={20} className="icon blue" />
                            <h2>Brand Settings</h2>
                        </div>
                        <div className="chevron-style" onClick={() => setOpenBrandSettings(!openBrandSettings)}>
                            {openBrandSettings ? <ChevronUp /> : <ChevronDown />}
                        </div>
                    </div>

                    {openBrandSettings && (
                        <>
                            <div className="form-group">
                                <label className="form-label"></label>

                                <div className="custom-upload-wrapper">
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden-input"
                                        disabled={uploadedImageBase64 != null}
                                    />
                                    <label htmlFor="image-upload" className="custom-upload-button" style={uploadedImageBase64 != null ? { backgroundColor: "#a3bffa" } : {}}>
                                        <Upload size={16} className="upload-icon" />
                                        <span>Upload Brand Logo</span>
                                    </label>
                                </div>
                                {uploadedImageBase64 && (
                                    <div className="image-preview-wrapper" style={{ marginTop: '1rem', position: 'relative', display: 'inline-block' }}>
                                        <img
                                            src={`data:image/png;base64,${uploadedImageBase64}`}
                                            alt="Uploaded"
                                            style={{ width: '120px', height: 'auto', borderRadius: '8px', border: '1px solid #ccc' }}
                                        />
                                        <button
                                            onClick={handleRemoveImage}
                                            style={{
                                                position: 'absolute',
                                                top: '-10px',
                                                right: '-10px',
                                                backgroundColor: '#fff',
                                                border: '1px solid #ccc',
                                                borderRadius: '50%',
                                                padding: '2px',
                                                width: '30px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="color-pickers">
                                <div className="color-picker">
                                    <label className="form-label">Primary</label>
                                    <div className="color-input-container">
                                        <input
                                            type="color"
                                            value={brandConfig.primaryColor}
                                            onChange={(e) => setBrandConfig({ ...brandConfig, primaryColor: e.target.value })}
                                            className="color-input"
                                        />
                                    </div>
                                </div>

                                <div className="color-picker">
                                    <label className="form-label">Secondary</label>
                                    <div className="color-input-container">
                                        <input
                                            type="color"
                                            value={brandConfig.secondaryColor}
                                            onChange={(e) => setBrandConfig({ ...brandConfig, secondaryColor: e.target.value })}
                                            className="color-input"
                                        />
                                    </div>
                                </div>


                                <div className="color-picker">
                                    <label className="form-label">Accent</label>
                                    <div className="color-input-container">
                                        <input
                                            type="color"
                                            value={brandConfig.accentColor}
                                            onChange={(e) => setBrandConfig({ ...brandConfig, accentColor: e.target.value })}
                                            className="color-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Brand Presets</label>
                                <div className="brand-presets">
                                    {brandPresets.map((preset, index) => (
                                        <button
                                            key={index}
                                            onClick={() => applyBrandPreset(preset)}
                                            className="preset-button"
                                        >
                                            <div
                                                className="color-swatch"
                                                style={{ backgroundColor: preset.primaryColor }}
                                            ></div>
                                            {preset.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>)}

                    <div className="section-header">
                        <div className="section-title">
                            <Camera size={20} className="icon blue" />
                            <h2>Visual Content</h2>
                        </div>
                        <div className="chevron-style" onClick={() => setVisualContent(!openVisualContent)}>
                            {openVisualContent ? <ChevronUp /> : <ChevronDown />}
                        </div>
                    </div>

                    {openVisualContent && (
                        <>
                            <div className="form-group">
                                <label className="form-label">Image Dimensions</label>
                                <div>
                                    <div className="form-group">
                                        <label className="form-label">Height</label>
                                        <input
                                            type="text"
                                            value={visualConfig.height}
                                            onChange={(e) => setVisualConfig({ ...visualConfig, height: e.target.value })}
                                            className="form-input"
                                            placeholder="Enter image height" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Width</label>
                                        <input
                                            type="text"
                                            value={visualConfig.width}
                                            onChange={(e) => setVisualConfig({ ...visualConfig, width: e.target.value })}
                                            className="form-input" placeholder="Enter image width" />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Template</label>
                                <div className="template-options">
                                    {templateStyles.map((template) => (
                                        <button
                                            key={template.id}
                                            onClick={() => setSelectedTemplate(template.id)}
                                            className={`template-button ${selectedTemplate === template.id ? 'selected' : ''
                                                }`}
                                        >
                                            <div className="template-info">
                                                <p className="template-name">{template.name}</p>
                                                <p className="template-description">{template.description}</p>
                                            </div>
                                            {selectedTemplate === template.id && (
                                                <div className="selected-indicator"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Image Style</label>
                                <div className="image-styles">
                                    {imageStyles.map((style) => (
                                        <button
                                            key={style.id}
                                            onClick={() => setVisualConfig({ ...visualConfig, imageStyle: style.id })}
                                            className={`style-button ${visualConfig.imageStyle === style.id ? 'selected' : ''
                                                }`}
                                        >
                                            {style.icon}
                                            <span>{style.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Visual Elements (select multiple)</label>
                                <div className="visual-elements">
                                    {['product', 'people', 'text-overlay', 'call-to-action', 'brand-logo'].map((element) => (
                                        <button
                                            key={element}
                                            onClick={() => toggleVisualElement(element)}
                                            className={`element-button ${visualConfig.visualElements.includes(element) ? 'selected' : ''
                                                }`}
                                        >
                                            {element.replace('-', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Visual Mood</label>
                                <select
                                    value={visualConfig.mood}
                                    onChange={(e) => setVisualConfig({ ...visualConfig, mood: e.target.value })}
                                    className="form-select"
                                >
                                    <option value="vibrant">Vibrant & Energetic</option>
                                    <option value="calm">Calm & Professional</option>
                                    <option value="luxurious">Luxury & Premium</option>
                                    <option value="friendly">Friendly & Approachable</option>
                                    <option value="minimalist">Clean & Minimalist</option>
                                </select>
                            </div>
                        </>)}

                    <button
                        onClick={generateImage}
                        disabled={generating}
                        className={`generate-button ${generating ? 'disabled' : ''}`}
                    >
                        {generating ? "Generating..." : (
                            <>
                                <Zap size={20} />
                                <span>Generate Image</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Preview panel */}
                <div className="preview-panel">
                    <div className="panel-header">
                        <div className="section-title">
                            <Monitor size={20} className="icon blue" />
                            <h2>Visual Preview</h2>
                        </div>

                        {imageGenerated && (
                            <div className="action-buttons">
                                <button onClick={handleDownload} className="download-button">
                                    <Download size={16} />
                                    <span>Download</span>
                                </button>

                                <button onClick={handleCopy} className="download-button">
                                    <Copy size={16} />
                                    <span>Copy</span>
                                </button>
                            </div>
                        )}

                    </div>

                    {generatedImage ? (
                        <div className="preview-content">
                            <div className="image-container">
                                {/* Display the generated image */}
                                <img
                                    src={generatedImage.url}
                                    alt={`Generated email visual for ${generatedImage.campaignName}`}
                                    className="generated-image"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="empty-preview">
                            {generating ? (
                                <div className="generating-message">
                                    <LoaderCircle size={32} className="loader" />
                                </div>
                            ) : (
                                <div className="placeholder-message">
                                    <Camera size={48} className="placeholder-icon" />
                                    <p className="placeholder-text">Fill in campaign details and design preferences</p>
                                    <p className="placeholder-subtext">Then click "Generate Image" to create your attention-grabbing content</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}