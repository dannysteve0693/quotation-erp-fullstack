# Seed Data Guide for ERP Quotation Module

## 📋 **Overview**
This seed data provides a comprehensive set of realistic test data for your ERP Quotation Module, including users, products, quotations, and sales orders across different scenarios.

## 🗂️ **Data Structure**

### **1. Users (8 total)**
- **3 Sales Users**: Different roles for testing approval workflows
  - `sales@company.com` - Main sales user
  - `john.sales@company.com` - Sales representative
  - `sarah.manager@company.com` - Sales manager
  
- **5 Customer Users**: Different types of businesses
  - `customer1@techcorp.com` - Tech company
  - `procurement@manufacturing.com` - Manufacturing business
  - `buyer@retailchain.com` - Retail chain
  - `orders@startup.io` - Startup company
  - `purchasing@logistics.com` - Logistics company

### **2. Products (13 total)**
- **Electronics (5)**: Laptops, monitors, peripherals
- **Office Supplies (5)**: Furniture, desk accessories
- **Software & Services (3)**: Licenses, cloud storage, training

### **3. Quotations (7 total)**
- **3 Pending**: Currently awaiting approval
- **2 Approved**: Approved and ready for conversion
- **1 Rejected**: Declined with reason
- **1 Converted**: Successfully converted to sales order

### **4. Sales Orders (3 total)**
- Generated from approved/converted quotations
- Include all original quotation items
- Proper customer and product references

### **5. Audit Trail (12 events)**
- Creation events for all quotations
- Status changes with reasons
- Proper user attribution

## 🎯 **Test Scenarios Covered**

### **Customer Workflow Testing**
- **TechCorp**: Has both pending and rejected quotations
- **Manufacturing**: Has pending and converted quotations
- **Retail Chain**: Has pending quotation
- **Startup**: Has approved quotation converted to sales order
- **Logistics**: Has approved quotation converted to sales order

### **Sales Workflow Testing**
- **Approvals**: Different sales users approving different quotations
- **Rejections**: Quotations rejected with business reasons
- **Conversions**: Approved quotations converted to sales orders

### **Product Testing**
- **Various Price Points**: From $29.99 to $999.99
- **Different Stock Levels**: Testing inventory constraints
- **Mixed Categories**: Electronics, furniture, software

## 📊 **Key Metrics from Seed Data**

### **Financial Summary**
- **Total Quotation Value**: $8,379.76
- **Approved Value**: $2,729.93
- **Pending Value**: $4,749.88
- **Rejected Value**: $3,999.96
- **Converted to Orders**: $2,729.93

### **Status Distribution**
- **Pending**: 3 quotations (42.8%)
- **Approved**: 2 quotations (28.6%)
- **Rejected**: 1 quotation (14.3%)
- **Converted**: 1 quotation (14.3%)

### **Product Popularity**
- **Most Quoted**: Laptop Computer (3 times)
- **Highest Value**: Standing Desk orders
- **Most Diverse**: Office furniture category

## 🚀 **How to Use**

### **1. Load the Data**
```bash
# Connect to your PostgreSQL database
psql -d your_database_name -f SEED_DATA.sql
```

### **2. Test Login Credentials**
**Note**: The password hashes are examples. In production, use proper bcrypt hashes.

**Sales Users:**
- `sales@company.com`
- `john.sales@company.com`
- `sarah.manager@company.com`

**Customer Users:**
- `customer1@techcorp.com`
- `procurement@manufacturing.com`
- `buyer@retailchain.com`
- `orders@startup.io`
- `purchasing@logistics.com`

### **3. Expected Behavior**
- **Customers** can see their own quotations
- **Sales users** can see all quotations and approve/reject them
- **Quotation numbers** display as "Q-1704110400000" format
- **Audit trail** shows complete history of changes

## 🔧 **Testing Scenarios**

### **Customer Login Tests**
1. **TechCorp Customer** (`customer1@techcorp.com`)
   - Should see 2 quotations: 1 pending, 1 rejected
   - Can create new quotations

2. **Manufacturing Customer** (`procurement@manufacturing.com`)
   - Should see 2 quotations: 1 pending, 1 converted
   - Can view sales order from converted quotation

### **Sales Login Tests**
1. **Sales User** (`sales@company.com`)
   - Can view all 7 quotations
   - Can approve/reject pending quotations
   - Can convert approved quotations to sales orders

2. **Sales Manager** (`sarah.manager@company.com`)
   - Has rejected one quotation (business reason documented)
   - Can override decisions if needed

### **Product Management Tests**
1. **Stock Levels**: Test quotations that exceed available stock
2. **Price Changes**: Verify unit prices match product prices
3. **Product Categories**: Test search and filtering

### **Audit Trail Tests**
1. **Creation Events**: Every quotation has creation audit entry
2. **Status Changes**: Approvals/rejections logged with reasons
3. **User Attribution**: Changes properly attributed to users

## 📝 **Data Relationships**

### **Complete Workflow Example**
**Quotation Q-1704628800000** (Manufacturing customer):
1. **Created**: 2024-01-16 14:00 by customer
2. **Approved**: 2024-01-16 16:30 by sales@company.com
3. **Converted**: 2024-01-16 16:30 to Sales Order
4. **Items**: 1x Standing Desk ($599.99)
5. **Status**: converted_to_order

### **Audit Trail Example**
```
1. Created by customer → Status: pending
2. Approved by sales → Status: approved (reason: "Approved for immediate processing")
3. Converted by sales → Status: converted_to_order (reason: "Converted to sales order")
```

## 🛠️ **Customization**

### **Adding More Data**
- **Users**: Add more sales reps or customer companies
- **Products**: Add more categories or price ranges
- **Quotations**: Create more complex multi-item quotations
- **Time Periods**: Spread data across different months

### **Business Rules Testing**
- **Approval Limits**: Test different approval thresholds
- **Stock Constraints**: Test out-of-stock scenarios
- **Customer Limits**: Test customer-specific pricing
- **Seasonal Data**: Add time-based variations

This seed data provides a solid foundation for testing all aspects of your ERP Quotation Module! 🎉