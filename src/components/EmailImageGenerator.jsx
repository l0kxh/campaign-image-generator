import { useState, useEffect } from "react";
import { Camera, Image, Layout, Sparkles, Zap, Mail, Palette, Layers, Monitor, Download } from "lucide-react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "tailwindcss";

export default function EmailImageGenerator() {
  // State for form inputs
  const [campaignName, setCampaignName] = useState("");
  const [coreMessage, setCoreMessage] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [imageGenerated, setImageGenerated] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  
  // Visual content configuration
  const [visualConfig, setVisualConfig] = useState({
    imageStyle: "product-focused",
    visualElements: ["product", "people", "text-overlay"],
    mood: "vibrant",
    imagePrompt: "",
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
  const generateVisualPrompt = () => {
    const prompt = `Create a professional email marketing ${visualConfig.imageStyle} image for ${campaignName} campaign. 
    Main message: "${coreMessage}". 
    Style: ${brandConfig.style}, Mood: ${visualConfig.mood}. 
    Use brand colors: ${brandConfig.primaryColor}, ${brandConfig.secondaryColor}, and ${brandConfig.accentColor}.
    Include visual elements: ${visualConfig.visualElements.join(", ")}.`;
    
    setVisualConfig({...visualConfig, imagePrompt: prompt});
    return prompt;
  };

  // Function to generate AI image using Google's Imagen API
  const generateImage = async () => {
    if (!campaignName || !coreMessage) {
      alert("Please fill in both campaign name and core message.");
      return;
    }
    
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }
    
    setGenerating(true);
    const visualPrompt = generateVisualPrompt();
    
    try {
      // Call Google Vertex AI Imagen API
      const response = await generateImageWithImagen(visualPrompt, apiKey);
      
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

  // Function to call Google's Imagen API
  const generateImageWithImagen = async (prompt, apiKey) => {
    // The URL for Google Vertex AI Imagen API
    const endpoint = "https://us-central1-aiplatform.googleapis.com/v1/projects/YOUR_PROJECT_ID/locations/us-central1/publishers/google/models/imagegeneration@002:predict";
    
    // Request body for Imagen
    const requestBody = {
      instances: [
        {
          prompt: prompt
        }
      ],
      parameters: {
        sampleCount: 1,
        // Additional parameters like safety filters can be added here
      }
    };
    
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${errorText}`);
      }
      
      const data = await response.json();
      
      // Extract the image data from the response
      // Note: This structure might need adjustment based on the actual API response
      const imageBase64 = data.predictions[0]?.bytesBase64Encoded;
      
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

  // Save API key
  const saveApiKey = () => {
    if (apiKey.trim()) {
      // In a production app, you'd want to store this securely
      // For demo purposes, we're just keeping it in state
      localStorage.setItem('imagen_api_key', apiKey);
      setShowApiKeyModal(false);
    } else {
      alert("Please enter a valid API key");
    }
  };

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('imagen_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg py-4 px-6 text-white">
        <div className="flex items-center gap-2">
          <Mail size={24} />
          <h1 className="text-2xl font-bold text-primary">Visual Email Generator</h1>
        </div>
        <p className="text-blue-100">Create eye-catching email visuals with Google's Imagen AI</p>
      </header>
      
      <main className="flex flex-col md:flex-row flex-1 p-6 gap-6">
        {/* Configuration panel */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-blue-500" />
              <h2 className="text-xl font-semibold">Campaign Details</h2>
            </div>
            <button 
              onClick={() => setShowApiKeyModal(true)}
              className="text-blue-500 text-sm hover:underline"
            >
              API Settings
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Campaign Name</label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Summer Sale 2025"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Core Message</label>
            <textarea
              value={coreMessage}
              onChange={(e) => setCoreMessage(e.target.value)}
              className="w-full p-2 border rounded h-24"
              placeholder="Get 30% off on all summer products!"
            />
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <Palette size={20} className="text-blue-500" />
            <h2 className="text-xl font-semibold">Brand Settings</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Primary</label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={brandConfig.primaryColor}
                  onChange={(e) => setBrandConfig({...brandConfig, primaryColor: e.target.value})}
                  className="w-8 h-8 border-0 rounded"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Secondary</label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={brandConfig.secondaryColor}
                  onChange={(e) => setBrandConfig({...brandConfig, secondaryColor: e.target.value})}
                  className="w-8 h-8 border-0 rounded"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Accent</label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={brandConfig.accentColor}
                  onChange={(e) => setBrandConfig({...brandConfig, accentColor: e.target.value})}
                  className="w-8 h-8 border-0 rounded"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Brand Presets</label>
            <div className="grid grid-cols-2 gap-2">
              {brandPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyBrandPreset(preset)}
                  className="text-xs p-2 border rounded hover:bg-gray-100 flex items-center"
                >
                  <div 
                    className="w-4 h-4 mr-1 rounded-full" 
                    style={{ backgroundColor: preset.primaryColor }}
                  ></div>
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <Camera size={20} className="text-blue-500" />
            <h2 className="text-xl font-semibold">Visual Content</h2>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email Template</label>
            <div className="grid grid-cols-1 gap-2">
              {templateStyles.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-2 border rounded flex items-center justify-between ${
                    selectedTemplate === template.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <p className="font-medium text-left">{template.name}</p>
                    <p className="text-xs text-gray-500 text-left">{template.description}</p>
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="bg-blue-500 w-4 h-4 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Image Style</label>
            <div className="grid grid-cols-2 gap-2">
              {imageStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setVisualConfig({...visualConfig, imageStyle: style.id})}
                  className={`p-2 border rounded flex items-center justify-center gap-2 ${
                    visualConfig.imageStyle === style.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                  }`}
                >
                  {style.icon}
                  <span>{style.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Visual Elements (select multiple)</label>
            <div className="grid grid-cols-2 gap-2">
              {['product', 'people', 'text-overlay', 'call-to-action', 'brand-logo'].map((element) => (
                <button
                  key={element}
                  onClick={() => toggleVisualElement(element)}
                  className={`p-2 border rounded text-sm ${
                    visualConfig.visualElements.includes(element) ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                  }`}
                >
                  {element.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Visual Mood</label>
            <select
              value={visualConfig.mood}
              onChange={(e) => setVisualConfig({...visualConfig, mood: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="vibrant">Vibrant & Energetic</option>
              <option value="calm">Calm & Professional</option>
              <option value="luxurious">Luxury & Premium</option>
              <option value="friendly">Friendly & Approachable</option>
              <option value="minimalist">Clean & Minimalist</option>
            </select>
          </div>
          
          <button
            onClick={generateImage}
            disabled={generating}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center gap-2"
          >
            {generating ? "Generating..." : (
              <>
                <Zap size={20} />
                <span>Generate with Imagen AI</span>
              </>
            )}
          </button>
        </div>
        
        {/* Preview panel */}
        <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Monitor size={20} className="text-blue-500" />
              <h2 className="text-xl font-semibold">Visual Preview</h2>
            </div>
            
            {imageGenerated && (
              <button
                onClick={handleDownload}
                className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Download size={16} />
                <span>Download</span>
              </button>
            )}
          </div>
          
          {generatedImage ? (
            <div className="flex flex-col items-center">
              <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg mb-4 relative">
                {/* Display the generated image */}
                <img 
                  src={generatedImage.url} 
                  alt={`Generated email visual for ${generatedImage.campaignName}`} 
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay for template elements if needed */}
                {selectedTemplate === "modern" && (
                  <div className="absolute top-0 right-0 w-1/2 h-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="p-8 text-white">
                      <div 
                        className="text-sm inline-block mb-4 px-3 py-1 rounded"
                        style={{ backgroundColor: generatedImage.accentColor }}
                      >
                        {generatedImage.campaignName}
                      </div>
                      <h3 className="text-3xl font-bold mb-6">
                        {generatedImage.coreMessage}
                      </h3>
                      <button 
                        className="px-6 py-2 rounded-full text-sm font-bold"
                        style={{ backgroundColor: "#ffffff", color: generatedImage.primaryColor }}
                      >
                        SHOP NOW
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Logo - Optional */}
                {visualConfig.visualElements.includes('brand-logo') && (
                  <div 
                    className="absolute top-4 left-4 w-12 h-12 flex items-center justify-center"
                    style={{ 
                      backgroundColor: "#ffffff",
                      borderRadius: '4px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}
                  >
                    <span style={{ color: generatedImage.primaryColor }} className="font-bold">LOGO</span>
                  </div>
                )}
              </div>
              
              {imageGenerated && (
                <div className="w-full">
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">AI Visual Prompt</h3>
                    <div className="bg-gray-50 p-4 rounded text-sm border border-gray-200">
                      <p>{generatedImage.visualPrompt}</p>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
                      <h4 className="font-medium text-blue-800 mb-2">Why This Works</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Vibrant visuals capture attention in crowded inboxes</li>
                        <li>• Consistent brand styling builds recognition</li>
                        <li>• Clear visual hierarchy directs user attention</li>
                        <li>• Visual elements support the core message</li>
                        <li>• Optimized for both desktop and mobile viewing</li>
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 p-4 rounded-lg mt-4">
                      <div>
                        <h4 className="font-medium text-green-800">Estimated Performance</h4>
                        <p className="text-sm text-green-700">This visual is likely to increase open rates by 15-25%</p>
                      </div>
                      <button
                        onClick={handleDownload}
                        className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                      >
                        <Download size={16} />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-96 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
              {generating ? (
                <div className="flex flex-col items-center">
                  <div className="loader mb-3"></div>
                  <p>Generating your eye-catching email visual with Google's Imagen AI...</p>
                </div>
              ) : (
                <div className="text-center p-8">
                  <Camera size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="mb-2">Fill in campaign details and design preferences</p>
                  <p className="text-sm">Then click "Generate with Imagen AI" to create your attention-grabbing content</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Google Imagen API Settings</h2>
            <p className="text-gray-600 mb-4">
              Enter your Google Cloud API key to use Imagen image generation. 
              You'll need to enable the Vertex AI API in your Google Cloud project.
            </p>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Google Cloud API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter your API key"
              />
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="py-2 px-4 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={saveApiKey}
                className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save API Key
              </button>
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              <p className="mb-1">To get started with Google's Imagen API:</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Create a Google Cloud account</li>
                <li>Create a new project</li>
                <li>Enable Vertex AI API</li>
                <li>Create API credentials</li>
                <li>Enter your API key above</li>
              </ol>
              <p className="mt-2">
                <a 
                  href="https://cloud.google.com/vertex-ai/docs/generative-ai/image/overview" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Learn more about Google Imagen
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .loader {
          border: 3px solid #f3f3f3;
          border-radius: 50%;
          border-top: 3px solid #3498db;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}