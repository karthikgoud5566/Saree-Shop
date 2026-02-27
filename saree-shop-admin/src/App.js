import React, { useState, useEffect } from 'react';

import { 
    Admin, 
    Resource, 
    List, 
    Datagrid, 
    TextField, 
    NumberField, 
    EditButton, 
    ShowButton,
    Create,
    SimpleForm,
    TextInput,
    NumberInput,
    Edit,
    Show,
    SimpleShowLayout,
    DateField,
    EmailField,
    FunctionField,
    SelectInput,
    ArrayField
} from 'react-admin';
import { dataProvider } from './dataProvider';
import authService from './services/authService';
import AdminLogin from './components/AdminLogin';
import { DeleteButton, useRefresh, useNotify } from 'react-admin';

// Saree Management Components

const SareeList = (props) => (
    <List {...props} title="Saree Inventory Management">
        <Datagrid>
            <TextField source="id" label="ID" />
            <FunctionField 
                label="Image" 
                render={record => 
                    record.imageUrl ? (
                        <img 
                            src={record.imageUrl} 
                            alt={record.title}
                            style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px'}}
                            onError={(e) => {
                                e.target.src = '/images/saree-placeholder.jpg';
                            }}
                        />
                    ) : (
                        <span style={{color: '#999'}}>No Image</span>
                    )
                } 
            />
            <TextField source="title" label="Saree Name" />
            <TextField source="fabric" label="Fabric" />
            <TextField source="color" label="Color" />
            <NumberField source="sellingPrice" label="Selling Price (₹)" />
            <NumberField source="costPrice" label="Cost Price (₹)" />
            <NumberField source="stockQuantity" label="Stock" />
            <EditButton />
            <ShowButton />
            {/* ❌ REMOVED: <ForceRefreshDeleteButton /> */}
        </Datagrid>
    </List>
);

// ✅ FIXED: Simplified SareeCreate without upload functionality
const SareeCreate = (props) => (
    <Create {...props} title="Add New Saree">
        <SimpleForm>
            <TextInput source="title" label="Saree Name" required />
            <TextInput source="fabric" label="Fabric (Silk, Cotton, etc.)" required />
            <TextInput source="color" label="Color" required />
            <NumberInput source="sellingPrice" label="Selling Price (₹)" required />
            <NumberInput source="costPrice" label="Cost Price (₹)" required />
            <NumberInput source="stockQuantity" label="Initial Stock Quantity" required />
            <TextInput source="description" label="Description" multiline />
            
            {/* ✅ OPTIONAL: Manual Image URL Input */}
            <TextInput 
                source="imageUrl" 
                label="Image URL (optional)" 
                fullWidth 
                helperText="You can add an image URL here, or upload an image after creating the saree"
            />
            
            {/* ✅ IMPROVED: Better instruction message */}
            <div style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#e8f5e8',
                borderRadius: '8px',
                border: '1px solid #4caf50'
            }}>
                <p style={{
                    margin: '0 0 10px 0',
                    color: '#2e7d32',
                    fontWeight: 'bold'
                }}>
                    📸 How to Add Saree Image:
                </p>
                <p style={{margin: 0, fontSize: '14px', color: '#388e3c'}}>
                    <strong>Step 1:</strong> Create the saree first by clicking "Save"<br/>
                    <strong>Step 2:</strong> Then click "Edit" and use the image upload feature<br/>
                    <strong>Alternative:</strong> Enter a direct image URL in the field above
                </p>
            </div>
        </SimpleForm>
    </Create>
);

// ✅ OPTIMIZED: SareeEdit with better image upload
const SareeEdit = (props) => {
    const [imageUploading, setImageUploading] = useState(false);
    
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        // Check file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            alert(`❌ File too large! Please choose an image smaller than 10MB.\n\nCurrent file size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
            return;
        }
        
        // Get saree ID from URL
        const hash = window.location.hash;
        const match = hash.match(/\/sarees\/(\d+)/);
        const sareeId = match ? match[1] : null;
        
        console.log("=== UPLOAD DEBUG ===");
        console.log("Saree ID:", sareeId);
        console.log("File:", file.name, `(${(file.size / 1024 / 1024).toFixed(2)}MB)`);
        console.log("===================");
        
        if (!sareeId || isNaN(sareeId)) {
            alert('❌ Cannot find saree ID. Please make sure you are editing an existing saree.');
            return;
        }
        
        setImageUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        
        try {
            const uploadResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/sarees/${sareeId}/upload-image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: formData
            });
            
            console.log("Upload response status:", uploadResponse.status);
            
            if (uploadResponse.ok) {
                const result = await uploadResponse.json();
                console.log("Upload successful:", result);
                alert('✅ Image uploaded successfully!');
                window.location.reload();
            } else {
                const errorText = await uploadResponse.text();
                console.error("Upload failed:", errorText);
                alert(`❌ Upload failed: ${errorText}`);
            }
            
        } catch (error) {
            console.error("Upload error:", error);
            alert(`❌ Upload error: ${error.message}`);
        } finally {
            setImageUploading(false);
        }
    };
    
    return (
        <Edit {...props} title="Edit Saree">
            <SimpleForm>
                <TextInput source="title" label="Saree Name" required />
                <TextInput source="fabric" label="Fabric" required />
                <TextInput source="color" label="Color" required />
                
                {/* ✅ IMPROVED: Image Upload Section */}
                <div style={{
                    margin: '20px 0',
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '2px solid #e9ecef'
                }}>
                    <label style={{
                        fontWeight: 'bold', 
                        display: 'block', 
                        marginBottom: '15px',
                        fontSize: '16px',
                        color: '#495057'
                    }}>
                        📸 Upload Saree Photo:
                    </label>
                    
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={imageUploading}
                        style={{
                            padding: '15px',
                            border: '2px dashed #007bff',
                            borderRadius: '8px',
                            width: '100%',
                            backgroundColor: imageUploading ? '#f8f9fa' : 'white',
                            cursor: imageUploading ? 'not-allowed' : 'pointer'
                        }}
                    />
                    
                    {imageUploading && (
                        <div style={{
                            marginTop: '15px',
                            padding: '10px',
                            backgroundColor: '#d4edda',
                            border: '1px solid #c3e6cb',
                            borderRadius: '5px',
                            color: '#155724',
                            fontWeight: 'bold'
                        }}>
                            🔄 Uploading image... Please wait!
                        </div>
                    )}
                    
                    <div style={{
                        marginTop: '10px',
                        fontSize: '14px',
                        color: '#6c757d'
                    }}>
                        💡 Supported formats: JPG, PNG, GIF. Maximum size: 10MB
                    </div>
                </div>
                
                <NumberInput source="sellingPrice" label="Selling Price (₹)" required />
                <NumberInput source="costPrice" label="Cost Price (₹)" required />
                <NumberInput source="stockQuantity" label="Stock Quantity" required />
                <TextInput source="description" label="Description" multiline />
                <TextInput source="imageUrl" label="Image URL (auto-filled after upload)" fullWidth disabled />
            </SimpleForm>
        </Edit>
    );
};

const SareeShow = (props) => (
    <Show {...props} title="Saree Details">
        <SimpleShowLayout>
            <TextField source="id" label="ID" />
            <FunctionField 
                label="Image" 
                render={record => 
                    record.imageUrl ? (
                        <img 
                            src={record.imageUrl} 
                            alt={record.title}
                            style={{width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px'}}
                            onError={(e) => {
                                e.target.src = '/images/saree-placeholder.jpg';
                            }}
                        />
                    ) : (
                        <span style={{color: '#999'}}>No Image Available</span>
                    )
                } 
            />
            <TextField source="title" label="Saree Name" />
            <TextField source="fabric" label="Fabric" />
            <TextField source="color" label="Color" />
            <NumberField source="sellingPrice" label="Selling Price (₹)" />
            <NumberField source="costPrice" label="Cost Price (₹)" />
            <NumberField source="stockQuantity" label="Current Stock" />
            <TextField source="description" label="Description" />
            <TextField source="imageUrl" label="Image URL" />
        </SimpleShowLayout>
    </Show>
);
const ForceRefreshDeleteButton = (props) => {
    const refresh = useRefresh();
    const notify = useNotify();

    const handleSuccess = () => {
        notify('Item deleted successfully', { type: 'success' });
        
        // Multiple refreshes to ensure UI updates properly
        setTimeout(() => {
            refresh();
        }, 100);
        
        setTimeout(() => {
            refresh();
        }, 800);
        
       
    };

    return (
        <DeleteButton
            {...props}
            mutationOptions={{
                onSuccess: handleSuccess,
            }}
        />
    );
};


// Customer Management Components

const CustomerList = (props) => (
    <List {...props} title="Customer Management">
        <Datagrid>
            <TextField source="id" label="ID" />
            <TextField source="name" label="Customer Name" />
            <TextField source="phoneNumber" label="Phone" />
            <EmailField source="email" label="Email" />
            <FunctionField 
                label="Outstanding (₹)"
                render={record => {
                    if (!record || record.totalOutstanding === undefined) {
                        return <span style={{color: '#999'}}>-</span>;
                    }
                    return `₹${record.totalOutstanding.toLocaleString()}`;
                }}
            />
            <FunctionField 
                label="Last Payment"
                render={record => {
                    if (!record || !record.lastPaymentDate) {
                        return <span style={{color: '#999'}}>No payments</span>;
                    }
                    return new Date(record.lastPaymentDate).toLocaleDateString();
                }}
            />
            <FunctionField 
                label="Status" 
                render={record => {
                    if (!record || record.totalOutstanding === undefined) {
                        return <span style={{color: '#999'}}>Loading...</span>;
                    }
                    
                    return record.totalOutstanding > 0 ? (
                        <span style={{
                            color: 'red', 
                            fontWeight: 'bold',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#ffebee'
                        }}>
                            ₹{record.totalOutstanding} Pending
                        </span>
                    ) : (
                        <span style={{
                            color: 'green', 
                            fontWeight: 'bold',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#e8f5e8'
                        }}>
                            Clear
                        </span>
                    );
                }} 
            />
            <EditButton />
            <ShowButton />
            <ForceRefreshDeleteButton />  {/* ✅ ADDED: Custom delete button */}
        </Datagrid>
    </List>
);


const CustomerCreate = (props) => (
    <Create {...props} title="Add New Customer">
        <SimpleForm>
            <TextInput source="name" label="Customer Name" required />
            <TextInput source="phoneNumber" label="Phone Number" required />
            <TextInput source="email" label="Email" type="email" />
            <TextInput source="address" label="Address" multiline />
            <TextInput source="preferences" label="Preferences (favorite colors, fabrics)" multiline />
        </SimpleForm>
    </Create>
);

const CustomerEdit = (props) => (
    <Edit {...props} title="Edit Customer">
        <SimpleForm>
            <TextInput source="name" label="Customer Name" required />
            <TextInput source="phoneNumber" label="Phone Number" required />
            <TextInput source="email" label="Email" type="email" />
            <TextInput source="address" label="Address" multiline />
            <TextInput source="preferences" label="Preferences" multiline />
        </SimpleForm>
    </Edit>
);

const CustomerShow = (props) => (
    <Show {...props} title="Customer Details">
        <SimpleShowLayout>
            <TextField source="id" label="Customer ID" />
            <TextField source="name" label="Name" />
            <TextField source="phoneNumber" label="Phone Number" />
            <EmailField source="email" label="Email" />
            <TextField source="address" label="Address" />
            <NumberField source="totalOutstanding" label="Total Outstanding (₹)" />
            <DateField source="lastPaymentDate" label="Last Payment Date" />
            <TextField source="preferences" label="Customer Preferences" />
        </SimpleShowLayout>
    </Show>
);

// Order Management Components
const OrderList = (props) => (
    <List {...props} title="Order Management">
        <Datagrid>
            <TextField source="id" label="Order #" />
            <TextField source="customer.name" label="Customer Name" />
            <TextField source="customer.phoneNumber" label="Phone" />
            <DateField source="orderDate" label="Order Date" showTime />
            <NumberField source="totalAmount" label="Total (₹)" />
            <NumberField source="paidAmount" label="Paid (₹)" />
            <NumberField source="pendingAmount" label="Pending (₹)" />
            <TextField source="paymentType" label="Payment Type" />
            <FunctionField 
                label="Status" 
                render={record => {
                    if (!record || !record.status) {
                        return <span style={{color: '#999'}}>-</span>;
                    }
                    
                    const getStatusColor = (status) => {
                        switch(status) {
                            case 'PENDING': return '#ff9800';
                            case 'CONFIRMED': return '#2196f3';
                            case 'DELIVERED': return '#4caf50';
                            case 'CANCELLED': return '#f44336';
                            default: return '#666';
                        }
                    };
                    return (
                        <span style={{
                            color: getStatusColor(record.status),
                            fontWeight: 'bold',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: getStatusColor(record.status) + '20'
                        }}>
                            {record.status}
                        </span>
                    );
                }}
            />
            <FunctionField 
                label="Payment Status" 
                render={record => {
                    if (!record || record.pendingAmount === undefined) {
                        return <span style={{color: '#999'}}>-</span>;
                    }
                    
                    return record.pendingAmount > 0 ? (
                        <span style={{color: 'red', fontWeight: 'bold'}}>₹{record.pendingAmount} Pending</span>
                    ) : (
                        <span style={{color: 'green', fontWeight: 'bold'}}>Fully Paid</span>
                    );
                }} 
            />
            <EditButton />
            <ShowButton />
            <ForceRefreshDeleteButton />  {/* ✅ ADDED: Custom delete button */}
        </Datagrid>
    </List>
);


const OrderEdit = (props) => (
    <Edit {...props} title="Update Order" transform={(data) => ({
        status: data.status,
        shippingAddress: data.shippingAddress,
        notes: data.notes
    })}>
        <SimpleForm>
            <TextInput source="id" label="Order ID" disabled />
            <TextInput source="customer.name" label="Customer Name" disabled />
            <NumberField source="totalAmount" label="Total Amount (₹)" disabled />
            <NumberField source="paidAmount" label="Paid Amount (₹)" disabled />
            <NumberField source="pendingAmount" label="Pending Amount (₹)" disabled />
            
            <SelectInput source="status" label="Order Status" choices={[
                { id: 'PENDING', name: 'Pending' },
                { id: 'CONFIRMED', name: 'Confirmed' },
                { id: 'PROCESSING', name: 'Processing' },
                { id: 'SHIPPED', name: 'Shipped' },
                { id: 'DELIVERED', name: 'Delivered' },
                { id: 'CANCELLED', name: 'Cancelled' },
            ]} />
            <TextInput source="shippingAddress" label="Shipping Address" multiline />
            <TextInput source="notes" label="Order Notes" multiline />
        </SimpleForm>
    </Edit>
);

const OrderShow = (props) => (
    <Show {...props} title="Order Details">
        <SimpleShowLayout>
            <TextField source="id" label="Order ID" />
            <TextField source="customer.name" label="Customer Name" />
            <TextField source="customer.phoneNumber" label="Customer Phone" />
            <TextField source="customer.email" label="Customer Email" />
            <TextField source="customer.address" label="Customer Address" />
            <DateField source="orderDate" label="Order Date" showTime />
            <NumberField source="totalAmount" label="Total Amount (₹)" />
            <NumberField source="paidAmount" label="Paid Amount (₹)" />
            <NumberField source="pendingAmount" label="Pending Amount (₹)" />
            <TextField source="paymentType" label="Payment Type" />
            <TextField source="status" label="Order Status" />
            <TextField source="shippingAddress" label="Shipping Address" />
            <TextField source="notes" label="Notes" />
            
            <ArrayField source="orderItems" label="Order Items">
                <Datagrid>
                    <TextField source="saree.title" label="Saree" />
                    <TextField source="saree.fabric" label="Fabric" />
                    <TextField source="saree.color" label="Color" />
                    <NumberField source="quantity" label="Quantity" />
                    <NumberField source="unitPrice" label="Unit Price (₹)" />
                    <NumberField source="totalPrice" label="Total Price (₹)" />
                </Datagrid>
            </ArrayField>

            <ArrayField source="installmentPayments" label="Payment History">
                <Datagrid>
                    <NumberField source="amount" label="Amount (₹)" />
                    <DateField source="paymentDate" label="Payment Date" showTime />
                    <TextField source="paymentMethod" label="Method" />
                    <TextField source="notes" label="Notes" />
                </Datagrid>
            </ArrayField>
        </SimpleShowLayout>
    </Show>
);

// Main App Component with Authentication
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    if (authService.isAuthenticated() && authService.isAdmin()) {
      setIsAuthenticated(true);
      setUser(authService.getUser());
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  };

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        Loading Admin Dashboard...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <Admin 
      dataProvider={dataProvider} 
      title={`Saree Shop Admin - Welcome ${user?.name}`}
      customRoutes={[]}
    >
      {/* Logout Button */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '20px',
        background: 'white',
        padding: '8px 16px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <button 
          onClick={handleLogout}
          style={{
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
      
      <Resource 
        name="sarees" 
        list={SareeList}
        create={SareeCreate}
        edit={SareeEdit}
        show={SareeShow}
        options={{ label: 'Saree Inventory' }}
      />
      <Resource 
        name="customers" 
        list={CustomerList}
        create={CustomerCreate}
        edit={CustomerEdit}
        show={CustomerShow}
        options={{ label: 'Customer Management' }}
      />
      <Resource 
        name="orders" 
        list={OrderList}
        edit={OrderEdit}
        show={OrderShow}
        options={{ label: 'Order Management' }}
      />
    </Admin>
  );
}

export default App;
