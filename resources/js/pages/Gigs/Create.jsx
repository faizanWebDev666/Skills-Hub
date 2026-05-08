import React, { useRef } from 'react';
import { useForm, Link } from '@inertiajs/react';
import Navbar from '../../components/Navbar';

const categories = [
    {
        id: 'developers',
        name: 'Developers',
        icon: '👨‍💻',
        description: 'Web, Mobile, & Software Developers',
        color: 'from-blue-500 to-cyan-500',
        fields: [
            { name: 'tech_stack', label: 'Tech Stack', type: 'multiselect', options: ['React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'PHP', 'Go', 'Rust', 'Swift', 'Kotlin', 'Flutter'] },
            { name: 'experience', label: 'Years of Experience', type: 'select', options: ['Less than 1 year', '1-3 years', '3-5 years', '5-10 years', '10+ years'] },
            { name: 'project_type', label: 'Project Types', type: 'multiselect', options: ['Website', 'Web App', 'Mobile App', 'Desktop App', 'API/Backend', 'Database', 'E-commerce', 'SaaS'] },
            { name: 'availability', label: 'Availability', type: 'select', options: ['Full-time', 'Part-time', 'Hourly', 'As needed'] },
            { name: 'portfolio_url', label: 'Portfolio URL', type: 'url', placeholder: 'https://yourportfolio.com' },
            { name: 'github_url', label: 'GitHub Profile', type: 'url', placeholder: 'https://github.com/yourusername' },
        ]
    },
    {
        id: 'designers',
        name: 'Designers',
        icon: '🎨',
        description: 'UI/UX, Graphic, & Product Designers',
        color: 'from-purple-500 to-pink-500',
        fields: [
            { name: 'design_specialty', label: 'Specialty', type: 'multiselect', options: ['UI Design', 'UX Design', 'Graphic Design', 'Logo Design', 'Brand Identity', 'Product Design', 'Web Design', 'Mobile App Design', 'Illustration', 'Motion Graphics'] },
            { name: 'tools', label: 'Tools Used', type: 'multiselect', options: ['Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'After Effects', 'InVision', 'Canva', 'Affinity Designer'] },
            { name: 'experience', label: 'Years of Experience', type: 'select', options: ['Less than 1 year', '1-3 years', '3-5 years', '5-10 years', '10+ years'] },
            { name: 'design_style', label: 'Design Style', type: 'select', options: ['Modern & Minimal', 'Bold & Creative', 'Corporate & Professional', 'Playful & Fun', 'Retro/Vintage'] },
            { name: 'portfolio_url', label: 'Portfolio URL', type: 'url', placeholder: 'https://yourportfolio.com' },
            { name: 'dribbble_url', label: 'Dribbble Profile', type: 'url', placeholder: 'https://dribbble.com/yourusername' },
        ]
    },
    {
        id: 'tutors',
        name: 'Tutors',
        icon: '👨‍🏫',
        description: 'Online & In-Person Tutoring Experts',
        color: 'from-green-500 to-emerald-500',
        fields: [
            { name: 'subjects', label: 'Subjects Taught', type: 'multiselect', options: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Programming', 'Languages', 'Music', 'Art', 'Test Prep (SAT/ACT)', 'Business'] },
            { name: 'education_level', label: 'Education Level', type: 'multiselect', options: ['Elementary', 'Middle School', 'High School', 'College/University', 'Adult Learners', 'Professional'] },
            { name: 'teaching_mode', label: 'Teaching Mode', type: 'multiselect', options: ['Online (Video Call)', 'In-Person', 'Hybrid'] },
            { name: 'hourly_rate', label: 'Hourly Rate ($)', type: 'number', placeholder: '25' },
            { name: 'qualifications', label: 'Qualifications', type: 'textarea', placeholder: 'Your degrees, certifications, or relevant experience...' },
            { name: 'availability', label: 'Availability', type: 'select', options: ['Weekdays only', 'Weekends only', 'Flexible', 'Evenings'] },
        ]
    },
    {
        id: 'electricians',
        name: 'Electricians',
        icon: '⚡',
        description: 'Licensed Electrical Services',
        color: 'from-yellow-500 to-orange-500',
        fields: [
            { name: 'services', label: 'Services Offered', type: 'multiselect', options: ['Wiring & Rewiring', 'Panel Installation', 'Lighting Installation', 'Ceiling Fans', 'Outlets & Switches', 'Circuit Breakers', 'Emergency Repairs', 'Smart Home', 'Electrical Inspections'] },
            { name: 'licensed', label: 'Are You Licensed?', type: 'select', options: ['Yes, Licensed', 'No, Unlicensed', 'Apprentice'] },
            { name: 'service_area', label: 'Service Area', type: 'text', placeholder: 'City, State or Zip Codes' },
            { name: 'emergency', label: 'Emergency Services', type: 'select', options: ['Available 24/7', 'Business Hours', 'Not Available'] },
            { name: 'insurance', label: 'Insured & Bonded', type: 'select', options: ['Yes', 'No', 'Working on it'] },
            { name: 'years_experience', label: 'Years of Experience', type: 'select', options: ['Less than 1 year', '1-5 years', '5-10 years', '10-20 years', '20+ years'] },
        ]
    },
    {
        id: 'repair_experts',
        name: 'Repair Experts',
        icon: '🔧',
        description: 'Home, Auto, & Tech Repair Specialists',
        color: 'from-red-500 to-rose-500',
        fields: [
            { name: 'repair_type', label: 'Repair Specialty', type: 'multiselect', options: ['Computer/Laptop', 'Phone/Tablet', 'TV & Electronics', 'Appliances', 'Plumbing', 'HVAC', 'Auto Repair', 'Bicycle', 'Furniture', 'Jewelry'] },
            { name: 'service_area', label: 'Service Area', type: 'text', placeholder: 'City, State or On-site/Remote' },
            { name: 'mobile_service', label: 'Mobile Service', type: 'select', options: ['Yes, I come to you', 'Shop/Office only', 'Both'] },
            { name: 'diagnostic_fee', label: 'Diagnostic Fee ($)', type: 'number', placeholder: '0 for free' },
            { name: 'warranty', label: 'Warranty Offered', type: 'select', options: ['30 days', '90 days', '6 months', '1 year', 'No warranty'] },
            { name: 'tools_included', label: 'Tools Provided', type: 'select', options: ['Yes, I bring everything', 'Customer provides', 'Depends on job'] },
        ]
    },
    {
        id: 'agencies',
        name: 'Agencies',
        icon: '🏢',
        description: 'Full-Service Creative & Marketing Agencies',
        color: 'from-indigo-500 to-violet-500',
        fields: [
            { name: 'agency_services', label: 'Services', type: 'multiselect', options: ['Digital Marketing', 'SEO', 'Social Media', 'Content Marketing', 'PPC Advertising', 'Brand Strategy', 'Web Development', 'Video Production', 'Public Relations'] },
            { name: 'team_size', label: 'Team Size', type: 'select', options: ['Solo', '2-5 people', '6-10 people', '11-20 people', '20+ people'] },
            { name: 'industries', label: 'Industries Served', type: 'multiselect', options: ['Tech', 'E-commerce', 'Healthcare', 'Finance', 'Real Estate', 'Education', 'Entertainment', 'Non-profit', 'Retail'] },
            { name: 'min_project', label: 'Minimum Project Size ($)', type: 'number', placeholder: '1000' },
            { name: 'website', label: 'Agency Website', type: 'url', placeholder: 'https://youragency.com' },
            { name: 'case_studies', label: 'Case Studies URL', type: 'url', placeholder: 'https://youragency.com/case-studies' },
        ]
    },
    {
        id: 'freelancers',
        name: 'Freelancers',
        icon: '💼',
        description: 'All-in-One Multi-Talented Professionals',
        color: 'from-teal-500 to-cyan-500',
        fields: [
            { name: 'skills', label: 'Core Skills', type: 'multiselect', options: ['Project Management', 'Virtual Assistant', 'Data Entry', 'Customer Service', 'Translation', 'Transcription', 'Research', 'Consulting', 'Coaching', 'Event Planning'] },
            { name: 'experience_years', label: 'Years of Experience', type: 'select', options: ['Less than 1 year', '1-3 years', '3-5 years', '5-10 years', '10+ years'] },
            { name: 'hourly_rate_range', label: 'Hourly Rate Range ($)', type: 'select', options: ['$15-25', '$25-50', '$50-75', '$75-100', '$100+'] },
            { name: 'work_preference', label: 'Work Preference', type: 'multiselect', options: ['Remote only', 'On-site only', 'Hybrid', 'Flexible'] },
            { name: 'linkedin_url', label: 'LinkedIn Profile', type: 'url', placeholder: 'https://linkedin.com/in/yourprofile' },
            { name: 'availability_hours', label: 'Weekly Availability', type: 'select', options: ['Less than 10 hours', '10-20 hours', '20-30 hours', '30-40 hours', '40+ hours'] },
        ]
    },
    {
        id: 'writers',
        name: 'Writers',
        icon: '✍️',
        description: 'Content, Copy, & Creative Writers',
        color: 'from-amber-500 to-yellow-500',
        fields: [
            { name: 'writing_type', label: 'Writing Services', type: 'multiselect', options: ['Blog Posts', 'Website Copy', 'Product Descriptions', 'Social Media', 'Email Marketing', 'Technical Writing', 'Creative Writing', 'Editing & Proofreading', 'Ghostwriting', 'Scriptwriting'] },
            { name: 'content_niches', label: 'Niches', type: 'multiselect', options: ['Technology', 'Business', 'Health & Wellness', 'Travel', 'Lifestyle', 'Finance', 'Education', 'Entertainment', 'E-commerce', 'B2B'] },
            { name: 'price_per_word', label: 'Price per Word (cents)', type: 'number', placeholder: '5' },
            { name: 'turnaround', label: 'Typical Turnaround', type: 'select', options: ['24 hours', '2-3 days', '1 week', '1-2 weeks', 'Flexible'] },
            { name: 'portfolio', label: 'Writing Portfolio', type: 'url', placeholder: 'https://yourwritingportfolio.com' },
            { name: 'samples_available', label: 'Samples Available', type: 'select', options: ['Yes, upon request', 'Yes, on my website', 'No, but can provide'] },
        ]
    },
];

export default function Create({ user }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        price: '',
        category: '',
        tags: [],
        tagInput: '',
        category_fields: {},
        image: null,
    });
    const fileInputRef = useRef(null);

    const selectedCategory = categories.find(c => c.id === data.category);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/gigs', {
            forceFormData: true,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
        }
    };

    const removeImage = () => {
        setData('image', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const addTag = (e) => {
        if (e.key === 'Enter' && data.tagInput.trim()) {
            e.preventDefault();
            if (!data.tags.includes(data.tagInput.trim())) {
                setData('tags', [...data.tags, data.tagInput.trim()]);
            }
            setData('tagInput', '');
        }
    };

    const removeTag = (tagToRemove) => {
        setData('tags', data.tags.filter(tag => tag !== tagToRemove));
    };

    const handleCategoryFieldChange = (fieldName, value) => {
        setData('category_fields', {
            ...data.category_fields,
            [fieldName]: value
        });
    };

    const toggleMultiselect = (fieldName, option) => {
        const current = data.category_fields[fieldName] || [];
        const newValue = current.includes(option)
            ? current.filter(item => item !== option)
            : [...current, option];
        handleCategoryFieldChange(fieldName, newValue);
    };

    return (
        <div className="min-h-screen bg-cream-50">
            <Navbar user={user} />
            <div className="py-12">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <Link href="/gigs" className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-600 mb-4 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Services
                            </Link>
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Create Your Service</h1>
                            <p className="text-xl text-gray-600">Showcase your expertise and start getting clients</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Step 1: Category */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white text-lg font-bold">1</span>
                                    Choose Your Category
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                                    {categories.map((category) => (
                                        <div
                                            key={category.id}
                                            onClick={() => setData('category', category.id)}
                                            className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                                                data.category === category.id
                                                    ? `border-transparent bg-gradient-to-br ${category.color} text-white shadow-lg`
                                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                            }`}
                                        >
                                            <div className="text-center">
                                                <span className="text-3xl sm:text-4xl mb-2 sm:mb-3 block">{category.icon}</span>
                                                <h3 className={`font-bold text-sm sm:text-lg ${data.category === category.id ? 'text-white' : 'text-gray-900'}`}>
                                                    {category.name}
                                                </h3>
                                                <p className={`text-xs sm:text-sm mt-1 ${data.category === category.id ? 'text-white/90' : 'text-gray-500'}`}>
                                                    {category.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {errors.category && <p className="mt-3 text-sm text-red-600">{errors.category}</p>}
                            </div>

                            {selectedCategory && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Left Column: Details */}
                                    <div className="lg:col-span-2 space-y-8">
                                        {/* Step 2: Service Info */}
                                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                                <span className={`w-10 h-10 bg-gradient-to-br ${selectedCategory.color} rounded-xl flex items-center justify-center text-white text-lg font-bold`}>2</span>
                                                Service Details
                                            </h2>

                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Service Title</label>
                                                    <input
                                                        type="text"
                                                        value={data.title}
                                                        onChange={(e) => setData('title', e.target.value)}
                                                        placeholder="e.g., Professional React Web Development"
                                                        className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all text-lg"
                                                        required
                                                    />
                                                    {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Detailed Description</label>
                                                    <textarea
                                                        value={data.description}
                                                        onChange={(e) => setData('description', e.target.value)}
                                                        placeholder="Describe your service, your experience, what clients can expect, etc..."
                                                        rows={6}
                                                        className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all resize-none"
                                                        required
                                                    />
                                                    {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Starting Price ($)</label>
                                                        <div className="relative">
                                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-xl font-bold">$</span>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                min="5"
                                                                value={data.price}
                                                                onChange={(e) => setData('price', e.target.value)}
                                                                placeholder="50"
                                                                className="w-full pl-14 pr-5 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all text-xl"
                                                                required
                                                            />
                                                        </div>
                                                        {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                                                        <div className="px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 text-lg font-medium text-gray-700 flex items-center gap-2">
                                                            <span>{selectedCategory.icon}</span>
                                                            {selectedCategory.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Step 3: Category-Specific Fields */}
                                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                                <span className={`w-10 h-10 bg-gradient-to-br ${selectedCategory.color} rounded-xl flex items-center justify-center text-white text-lg font-bold`}>3</span>
                                                {selectedCategory.name} Details
                                            </h2>

                                            <div className="space-y-6">
                                                {selectedCategory.fields.map((field) => (
                                                    <div key={field.name}>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-3">{field.label}</label>
                                                        
                                                        {field.type === 'text' && (
                                                            <input
                                                                type="text"
                                                                value={data.category_fields[field.name] || ''}
                                                                onChange={(e) => handleCategoryFieldChange(field.name, e.target.value)}
                                                                placeholder={field.placeholder}
                                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all"
                                                            />
                                                        )}

                                                        {field.type === 'url' && (
                                                            <input
                                                                type="url"
                                                                value={data.category_fields[field.name] || ''}
                                                                onChange={(e) => handleCategoryFieldChange(field.name, e.target.value)}
                                                                placeholder={field.placeholder}
                                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all"
                                                            />
                                                        )}

                                                        {field.type === 'number' && (
                                                            <input
                                                                type="number"
                                                                value={data.category_fields[field.name] || ''}
                                                                onChange={(e) => handleCategoryFieldChange(field.name, e.target.value)}
                                                                placeholder={field.placeholder}
                                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all"
                                                            />
                                                        )}

                                                        {field.type === 'textarea' && (
                                                            <textarea
                                                                value={data.category_fields[field.name] || ''}
                                                                onChange={(e) => handleCategoryFieldChange(field.name, e.target.value)}
                                                                placeholder={field.placeholder}
                                                                rows={4}
                                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all resize-none"
                                                            />
                                                        )}

                                                        {field.type === 'select' && (
                                                            <select
                                                                value={data.category_fields[field.name] || ''}
                                                                onChange={(e) => handleCategoryFieldChange(field.name, e.target.value)}
                                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all"
                                                            >
                                                                <option value="">Select...</option>
                                                                {field.options.map((option) => (
                                                                    <option key={option} value={option}>{option}</option>
                                                                ))}
                                                            </select>
                                                        )}

                                                        {field.type === 'multiselect' && (
                                                            <div className="flex flex-wrap gap-2">
                                                                {field.options.map((option) => (
                                                                    <button
                                                                        key={option}
                                                                        type="button"
                                                                        onClick={() => toggleMultiselect(field.name, option)}
                                                                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border-2 transition-all duration-200 font-medium text-sm ${
                                                                            (data.category_fields[field.name] || []).includes(option)
                                                                                ? `border-transparent bg-gradient-to-r ${selectedCategory.color} text-white`
                                                                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                                                        }`}
                                                                    >
                                                                        {option}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Image + Tags */}
                                    <div className="space-y-8">
                                        {/* Step 4: Image Upload */}
                                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                                <span className={`w-10 h-10 bg-gradient-to-br ${selectedCategory.color} rounded-xl flex items-center justify-center text-white text-lg font-bold`}>4</span>
                                                Service Image
                                            </h2>

                                            <div>
                                                {data.image ? (
                                                    <div className="relative group">
                                                        <img
                                                            src={URL.createObjectURL(data.image)}
                                                            alt="Preview"
                                                            className="w-full h-56 object-cover rounded-xl border border-gray-200"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={removeImage}
                                                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                        >
                                                            ×
                                                        </button>
                                                        <p className="text-sm text-gray-500 mt-2 truncate">{data.image.name}</p>
                                                    </div>
                                                ) : (
                                                    <div
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/50 transition-all"
                                                    >
                                                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <p className="text-gray-600 font-medium">Click to upload an image</p>
                                                        <p className="text-gray-400 text-sm mt-1">PNG, JPG, WEBP up to 2MB</p>
                                                    </div>
                                                )}
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/jpg,image/webp"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                                {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image}</p>}
                                            </div>
                                        </div>

                                        {/* Step 5: Tags */}
                                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                                <span className={`w-10 h-10 bg-gradient-to-br ${selectedCategory.color} rounded-xl flex items-center justify-center text-white text-lg font-bold`}>5</span>
                                                Tags
                                            </h2>

                                            <div>
                                                <input
                                                    type="text"
                                                    value={data.tagInput}
                                                    onChange={(e) => setData('tagInput', e.target.value)}
                                                    onKeyPress={addTag}
                                                    placeholder="Type a tag and press Enter"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all"
                                                />
                                                {data.tags.length > 0 && (
                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                        {data.tags.map((tag, index) => (
                                                            <span
                                                                key={index}
                                                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 text-brand-800 font-medium text-sm"
                                                            >
                                                                {tag}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeTag(tag)}
                                                                    className="hover:text-red-600 transition-colors"
                                                                >
                                                                    ×
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link
                                    href="/gigs"
                                    className="flex-1 px-8 py-4 rounded-xl border-2 border-cream-300 text-gray-700 font-bold hover:bg-cream-100 transition-all text-center"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing || !data.category}
                                    className="flex-1 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-800 text-white font-bold hover:shadow-lg hover:shadow-brand-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Creating Service...' : 'Publish Service'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
