---
title: "Python 数据分析入门指南"
excerpt: "从零开始学习 Python 数据分析，掌握 Pandas、NumPy、Matplotlib 等核心库，学会数据清洗、处理、可视化技能。"
date: "2024-01-08"
category: "data-science"
tags: ["python", "pandas", "numpy", "data-analysis"]
cover: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop"
author: "Jacory"
readTime: "21 min"
---

# Python 数据分析入门指南

Python 凭借其丰富的数据分析库生态系统，成为数据科学领域的首选语言。本文将带你从基础开始，系统学习 Python 数据分析技能。

## 数据分析核心库

### 核心库概览

📊 **NumPy**：数值计算基础库  
🐼 **Pandas**：数据操作和分析  
📈 **Matplotlib**：基础绘图库  
🎨 **Seaborn**：统计数据可视化  
🔬 **SciPy**：科学计算  
🤖 **Scikit-learn**：机器学习  

### 环境搭建

```bash
# 创建虚拟环境
python -m venv data_analysis_env
source data_analysis_env/bin/activate  # Linux/Mac
# data_analysis_env\Scripts\activate  # Windows

# 安装核心库
pip install numpy pandas matplotlib seaborn scipy scikit-learn jupyter

# 或使用 Anaconda
conda create -n data_analysis python=3.9
conda activate data_analysis
conda install numpy pandas matplotlib seaborn scipy scikit-learn jupyter
```

## NumPy 数值计算基础

### 数组创建和操作

```python
import numpy as np

# 创建数组
arr1 = np.array([1, 2, 3, 4, 5])
arr2 = np.array([[1, 2, 3], [4, 5, 6]])

# 特殊数组
zeros = np.zeros((3, 4))        # 零数组
ones = np.ones((2, 3))          # 全一数组
identity = np.eye(3)            # 单位矩阵
random_arr = np.random.rand(3, 3)  # 随机数组

# 等间距数组
linear = np.linspace(0, 10, 50)   # 0到10之间50个点
arange = np.arange(0, 10, 0.5)    # 0到10，步长0.5

print(f"数组形状: {arr2.shape}")
print(f"数组维度: {arr2.ndim}")
print(f"数组大小: {arr2.size}")
print(f"数据类型: {arr2.dtype}")
```

### 数组运算

```python
# 数学运算
a = np.array([1, 2, 3, 4])
b = np.array([10, 20, 30, 40])

# 基础运算
print(f"加法: {a + b}")
print(f"乘法: {a * b}")
print(f"平方: {a ** 2}")
print(f"开方: {np.sqrt(a)}")

# 统计运算
data = np.random.randn(1000)
print(f"均值: {np.mean(data):.3f}")
print(f"标准差: {np.std(data):.3f}")
print(f"最大值: {np.max(data):.3f}")
print(f"最小值: {np.min(data):.3f}")

# 数组索引和切片
arr = np.array([[1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12]])

print(f"第二行: {arr[1]}")
print(f"第三列: {arr[:, 2]}")
print(f"子数组: {arr[1:3, 1:3]}")

# 布尔索引
mask = arr > 6
print(f"大于6的元素: {arr[mask]}")
```

### 数组重塑和合并

```python
# 数组重塑
original = np.arange(12)
reshaped = original.reshape(3, 4)
flattened = reshaped.flatten()

print(f"原数组: {original}")
print(f"重塑后:\n{reshaped}")
print(f"展平后: {flattened}")

# 数组合并
a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])

# 垂直合并
vertical = np.vstack((a, b))
# 水平合并
horizontal = np.hstack((a, b))

print(f"垂直合并:\n{vertical}")
print(f"水平合并:\n{horizontal}")
```

## Pandas 数据操作

### DataFrame 基础

```python
import pandas as pd
import numpy as np

# 创建 DataFrame
data = {
    'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
    'age': [25, 30, 35, 28, 32],
    'city': ['New York', 'London', 'Tokyo', 'Paris', 'Sydney'],
    'salary': [50000, 60000, 70000, 55000, 65000],
    'department': ['IT', 'HR', 'IT', 'Marketing', 'IT']
}

df = pd.DataFrame(data)
print(df)
print("\n基本信息:")
print(df.info())
print("\n统计描述:")
print(df.describe())
```

### 数据选择和过滤

```python
# 列选择
print(f"姓名列:\n{df['name']}")
print(f"多列选择:\n{df[['name', 'age']]}")

# 行选择
print(f"前3行:\n{df.head(3)}")
print(f"第2到4行:\n{df.iloc[1:4]}")

# 条件过滤
it_employees = df[df['department'] == 'IT']
high_earners = df[df['salary'] > 60000]
young_it = df[(df['age'] < 30) & (df['department'] == 'IT')]

print(f"IT部门员工:\n{it_employees}")
print(f"高收入员工:\n{high_earners}")
print(f"年轻IT员工:\n{young_it}")

# 使用 query 方法
result = df.query('age > 30 and salary > 55000')
print(f"Query结果:\n{result}")
```

### 数据清洗

```python
# 创建包含缺失值的数据
dirty_data = {
    'name': ['Alice', 'Bob', None, 'Diana', 'Eve'],
    'age': [25, None, 35, 28, 32],
    'salary': [50000, 60000, 70000, None, 65000],
    'email': ['alice@email.com', 'bob@email', 'charlie@email.com', 'diana@email.com', None]
}

dirty_df = pd.DataFrame(dirty_data)
print("原数据:")
print(dirty_df)
print(f"\n缺失值统计:\n{dirty_df.isnull().sum()}")

# 处理缺失值
# 删除包含缺失值的行
clean_df = dirty_df.dropna()
print(f"\n删除缺失值后:\n{clean_df}")

# 填充缺失值
filled_df = dirty_df.copy()
filled_df['age'].fillna(filled_df['age'].mean(), inplace=True)
filled_df['salary'].fillna(filled_df['salary'].median(), inplace=True)
filled_df['name'].fillna('Unknown', inplace=True)
filled_df['email'].fillna('no-email@example.com', inplace=True)

print(f"\n填充缺失值后:\n{filled_df}")

# 数据类型转换
df['age'] = df['age'].astype('int32')
df['salary'] = df['salary'].astype('float64')

# 删除重复值
df_no_duplicates = df.drop_duplicates()

# 字符串处理
df['name_upper'] = df['name'].str.upper()
df['name_length'] = df['name'].str.len()
```

### 数据聚合和分组

```python
# 按部门分组统计
dept_stats = df.groupby('department').agg({
    'age': ['mean', 'min', 'max'],
    'salary': ['mean', 'sum', 'count']
})

print("部门统计:")
print(dept_stats)

# 多级分组
city_dept_stats = df.groupby(['city', 'department'])['salary'].mean()
print("\n城市-部门平均薪资:")
print(city_dept_stats)

# 自定义聚合函数
def salary_range(series):
    return series.max() - series.min()

custom_agg = df.groupby('department')['salary'].agg(['mean', salary_range])
print("\n自定义聚合:")
print(custom_agg)

# 数据透视表
pivot_table = df.pivot_table(
    values='salary', 
    index='department', 
    columns='city', 
    aggfunc='mean',
    fill_value=0
)
print("\n数据透视表:")
print(pivot_table)
```

## 数据可视化

### Matplotlib 基础绘图

```python
import matplotlib.pyplot as plt
import matplotlib as mpl

# 设置中文字体和样式
plt.rcParams['font.sans-serif'] = ['SimHei']  # 用来正常显示中文标签
plt.rcParams['axes.unicode_minus'] = False    # 用来正常显示负号
plt.style.use('seaborn-v0_8')  # 使用seaborn样式

# 生成示例数据
x = np.linspace(0, 10, 100)
y1 = np.sin(x)
y2 = np.cos(x)

# 基础线图
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# 子图1：线图
axes[0, 0].plot(x, y1, label='sin(x)', linewidth=2)
axes[0, 0].plot(x, y2, label='cos(x)', linewidth=2)
axes[0, 0].set_title('三角函数')
axes[0, 0].legend()
axes[0, 0].grid(True)

# 子图2：散点图
ages = np.random.normal(30, 5, 100)
salaries = ages * 2000 + np.random.normal(0, 5000, 100)
axes[0, 1].scatter(ages, salaries, alpha=0.6)
axes[0, 1].set_title('年龄与薪资关系')
axes[0, 1].set_xlabel('年龄')
axes[0, 1].set_ylabel('薪资')

# 子图3：柱状图
departments = ['IT', 'HR', 'Marketing', 'Finance']
employee_counts = [45, 20, 15, 25]
axes[1, 0].bar(departments, employee_counts, color=['skyblue', 'lightgreen', 'lightcoral', 'gold'])
axes[1, 0].set_title('各部门人数')
axes[1, 0].set_ylabel('人数')

# 子图4：饼图
axes[1, 1].pie(employee_counts, labels=departments, autopct='%1.1f%%', startangle=90)
axes[1, 1].set_title('部门人数分布')

plt.tight_layout()
plt.show()
```

### Seaborn 统计可视化

```python
import seaborn as sns

# 创建示例数据集
np.random.seed(42)
data = pd.DataFrame({
    'department': np.random.choice(['IT', 'HR', 'Marketing', 'Finance'], 200),
    'experience': np.random.randint(0, 15, 200),
    'age': np.random.randint(22, 60, 200),
    'salary': np.random.randint(30000, 120000, 200),
    'performance': np.random.choice(['Low', 'Medium', 'High'], 200)
})

# 创建图形
fig, axes = plt.subplots(2, 3, figsize=(18, 12))

# 1. 相关性热力图
correlation_matrix = data[['experience', 'age', 'salary']].corr()
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', ax=axes[0, 0])
axes[0, 0].set_title('变量相关性热力图')

# 2. 箱线图
sns.boxplot(data=data, x='department', y='salary', ax=axes[0, 1])
axes[0, 1].set_title('各部门薪资分布')
axes[0, 1].tick_params(axis='x', rotation=45)

# 3. 小提琴图
sns.violinplot(data=data, x='performance', y='salary', ax=axes[0, 2])
axes[0, 2].set_title('绩效与薪资关系')

# 4. 散点图矩阵
numeric_data = data[['experience', 'age', 'salary']]
pd.plotting.scatter_matrix(numeric_data, ax=axes[1, 0], figsize=(6, 6))
axes[1, 0].set_title('数值变量散点图矩阵')

# 5. 分布图
sns.histplot(data=data, x='salary', hue='department', ax=axes[1, 1])
axes[1, 1].set_title('薪资分布（按部门）')

# 6. 点图
sns.pointplot(data=data, x='performance', y='salary', hue='department', ax=axes[1, 2])
axes[1, 2].set_title('绩效-薪资趋势（按部门）')
axes[1, 2].tick_params(axis='x', rotation=45)

plt.tight_layout()
plt.show()
```

## 实际案例：销售数据分析

```python
# 创建模拟销售数据
np.random.seed(123)
dates = pd.date_range('2023-01-01', '2023-12-31', freq='D')

sales_data = pd.DataFrame({
    'date': dates,
    'product': np.random.choice(['产品A', '产品B', '产品C', '产品D'], len(dates)),
    'region': np.random.choice(['北区', '南区', '东区', '西区'], len(dates)),
    'sales_amount': np.random.randint(1000, 10000, len(dates)),
    'units_sold': np.random.randint(10, 100, len(dates)),
    'customer_count': np.random.randint(5, 50, len(dates))
})

# 添加季节性趋势
sales_data['month'] = sales_data['date'].dt.month
sales_data['quarter'] = sales_data['date'].dt.quarter
sales_data['weekday'] = sales_data['date'].dt.day_name()

print("销售数据概览:")
print(sales_data.head())
print(f"\n数据形状: {sales_data.shape}")
print(f"\n基本统计:\n{sales_data.describe()}")
```

### 时间序列分析

```python
# 按日期聚合销售数据
daily_sales = sales_data.groupby('date')['sales_amount'].sum().reset_index()

# 按月统计
monthly_sales = sales_data.groupby(sales_data['date'].dt.to_period('M'))['sales_amount'].sum()

# 按产品和地区分析
product_region_sales = sales_data.groupby(['product', 'region'])['sales_amount'].sum().unstack()

# 可视化时间序列
fig, axes = plt.subplots(3, 1, figsize=(15, 12))

# 日销售趋势
axes[0].plot(daily_sales['date'], daily_sales['sales_amount'])
axes[0].set_title('日销售额趋势')
axes[0].set_ylabel('销售额')
axes[0].grid(True)

# 月销售趋势
monthly_sales.plot(kind='bar', ax=axes[1])
axes[1].set_title('月销售额')
axes[1].set_ylabel('销售额')
axes[1].tick_params(axis='x', rotation=45)

# 产品-地区热力图
sns.heatmap(product_region_sales, annot=True, fmt='.0f', cmap='YlOrRd', ax=axes[2])
axes[2].set_title('产品-地区销售热力图')

plt.tight_layout()
plt.show()
```

### 深度分析

```python
# 1. 销售趋势分析
# 计算移动平均
sales_data_sorted = daily_sales.sort_values('date')
sales_data_sorted['ma_7'] = sales_data_sorted['sales_amount'].rolling(window=7).mean()
sales_data_sorted['ma_30'] = sales_data_sorted['sales_amount'].rolling(window=30).mean()

# 2. 季节性分析
seasonal_analysis = sales_data.groupby('month').agg({
    'sales_amount': ['mean', 'sum', 'std'],
    'units_sold': 'sum',
    'customer_count': 'mean'
}).round(2)

print("季节性分析:")
print(seasonal_analysis)

# 3. 产品表现分析
product_performance = sales_data.groupby('product').agg({
    'sales_amount': ['sum', 'mean'],
    'units_sold': 'sum',
    'customer_count': 'sum'
}).round(2)

product_performance.columns = ['总销售额', '平均销售额', '总销量', '总客户数']
product_performance['单价'] = product_performance['总销售额'] / product_performance['总销量']

print("\n产品表现分析:")
print(product_performance)

# 4. 地区分析
region_analysis = sales_data.groupby('region').agg({
    'sales_amount': ['sum', 'mean'],
    'units_sold': 'sum'
}).round(2)

print("\n地区分析:")
print(region_analysis)

# 5. 工作日vs周末分析
sales_data['is_weekend'] = sales_data['weekday'].isin(['Saturday', 'Sunday'])
weekend_analysis = sales_data.groupby('is_weekend')['sales_amount'].agg(['mean', 'sum'])
weekend_analysis.index = ['工作日', '周末']

print("\n工作日vs周末分析:")
print(weekend_analysis)
```

### 高级可视化

```python
# 创建综合仪表板
fig = plt.figure(figsize=(20, 15))

# 1. 时间趋势（占用大部分空间）
ax1 = plt.subplot(3, 3, (1, 3))
ax1.plot(sales_data_sorted['date'], sales_data_sorted['sales_amount'], alpha=0.3, label='日销售额')
ax1.plot(sales_data_sorted['date'], sales_data_sorted['ma_7'], label='7日移动平均')
ax1.plot(sales_data_sorted['date'], sales_data_sorted['ma_30'], label='30日移动平均')
ax1.set_title('销售趋势分析', fontsize=14, fontweight='bold')
ax1.legend()
ax1.grid(True)

# 2. 产品销售分布
ax2 = plt.subplot(3, 3, 4)
product_sales = sales_data.groupby('product')['sales_amount'].sum()
ax2.pie(product_sales.values, labels=product_sales.index, autopct='%1.1f%%')
ax2.set_title('产品销售分布')

# 3. 地区销售对比
ax3 = plt.subplot(3, 3, 5)
region_sales = sales_data.groupby('region')['sales_amount'].sum()
bars = ax3.bar(region_sales.index, region_sales.values, color=['skyblue', 'lightgreen', 'lightcoral', 'gold'])
ax3.set_title('地区销售对比')
ax3.set_ylabel('销售额')
# 在柱子上添加数值标签
for bar in bars:
    height = bar.get_height()
    ax3.text(bar.get_x() + bar.get_width()/2., height,
             f'{height:,.0f}', ha='center', va='bottom')

# 4. 月度趋势
ax4 = plt.subplot(3, 3, 6)
monthly_trend = sales_data.groupby('month')['sales_amount'].mean()
ax4.plot(monthly_trend.index, monthly_trend.values, marker='o')
ax4.set_title('月度平均销售额')
ax4.set_xlabel('月份')
ax4.set_ylabel('平均销售额')
ax4.grid(True)

# 5. 销售额分布直方图
ax5 = plt.subplot(3, 3, 7)
ax5.hist(sales_data['sales_amount'], bins=30, alpha=0.7, color='steelblue')
ax5.set_title('销售额分布')
ax5.set_xlabel('销售额')
ax5.set_ylabel('频次')

# 6. 相关性分析
ax6 = plt.subplot(3, 3, 8)
correlation_data = sales_data[['sales_amount', 'units_sold', 'customer_count']].corr()
sns.heatmap(correlation_data, annot=True, cmap='coolwarm', ax=ax6)
ax6.set_title('变量相关性')

# 7. 箱线图
ax7 = plt.subplot(3, 3, 9)
sns.boxplot(data=sales_data, x='quarter', y='sales_amount', ax=ax7)
ax7.set_title('季度销售额分布')

plt.tight_layout()
plt.show()

# 生成分析报告
print("\n=== 销售数据分析报告 ===")
print(f"分析期间: {sales_data['date'].min().strftime('%Y-%m-%d')} 至 {sales_data['date'].max().strftime('%Y-%m-%d')}")
print(f"总销售额: {sales_data['sales_amount'].sum():,} 元")
print(f"平均日销售额: {sales_data['sales_amount'].mean():,.0f} 元")
print(f"最高日销售额: {sales_data['sales_amount'].max():,} 元")
print(f"最低日销售额: {sales_data['sales_amount'].min():,} 元")

# 找出最佳表现
best_product = product_performance['总销售额'].idxmax()
best_region = region_analysis[('sales_amount', 'sum')].idxmax()
best_month = seasonal_analysis[('sales_amount', 'sum')].idxmax()

print(f"\n=== 关键洞察 ===")
print(f"最佳产品: {best_product}")
print(f"最佳地区: {best_region}")
print(f"最佳月份: {best_month}月")

# 计算增长趋势
first_half = sales_data[sales_data['date'] < '2023-07-01']['sales_amount'].sum()
second_half = sales_data[sales_data['date'] >= '2023-07-01']['sales_amount'].sum()
growth_rate = ((second_half - first_half) / first_half) * 100

print(f"下半年vs上半年增长率: {growth_rate:.1f}%")
```

## 数据导入导出

```python
# 读取不同格式的数据
# CSV 文件
df_csv = pd.read_csv('sales_data.csv')

# Excel 文件
df_excel = pd.read_excel('sales_data.xlsx', sheet_name='Sheet1')

# JSON 文件
df_json = pd.read_json('sales_data.json')

# 数据库
import sqlite3
conn = sqlite3.connect('sales.db')
df_db = pd.read_sql_query("SELECT * FROM sales", conn)

# 保存数据
sales_data.to_csv('processed_sales.csv', index=False, encoding='utf-8')
sales_data.to_excel('processed_sales.xlsx', index=False, sheet_name='销售数据')
sales_data.to_json('processed_sales.json', orient='records', force_ascii=False)

# 保存到数据库
sales_data.to_sql('processed_sales', conn, if_exists='replace', index=False)
```

## 总结

Python 数据分析提供了强大而灵活的工具集：

✨ **NumPy**：高效的数值计算基础  
✨ **Pandas**：强大的数据操作和分析能力  
✨ **Matplotlib/Seaborn**：丰富的可视化选项  
✨ **完整的工作流**：数据清洗→分析→可视化→洞察  

掌握这些技能，你就能从数据中发现有价值的商业洞察，为决策提供数据支持！

---

*数据是新时代的黄金，用 Python 挖掘数据的价值！*
