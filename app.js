// ===================== 1. 轮播图核心功能 =====================
let currentSlide = 0;
const totalSlides = 4;
const carousel = document.querySelector('.carousel');
const indicators = document.querySelectorAll('.indicator');
let slideInterval = setInterval(nextSlide, 5000);

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlidePosition();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlidePosition();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlidePosition();
}

function updateSlidePosition() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
    carousel.style.transform = `translateX(-${currentSlide * 25}%)`;
    indicators.forEach((indicator, index) => {
        index === currentSlide ? indicator.classList.add('active') : indicator.classList.remove('active');
    });
}

// ===================== 2. 图书对象封装（字面量 + 构造函数） =====================
// 基础图书数据（字面量方式）
const bookList = [
    { 
        title: "Python编程从入门到精通", 
        author: "王小明", 
        category: "技术", 
        price: 89, 
        cover: "408592b73c26aaf758816c52d3c71e14.jpg",
        rating: "5.0分 (1200+评价)",
        desc: "从零开始讲解Python编程，涵盖基础语法、Web开发、数据分析等领域，配套大量实战案例。适合零基础入门，也可作为进阶学习参考，附带配套视频和源码。"
    },
    { 
        title: "中国历史纲要", 
        author: "李华", 
        category: "历史", 
        price: 129, 
        cover: "908ad82acc36ef4a1ea581f16b0f8807.jpg",
        rating: "4.8分 (890+评价)",
        desc: "全景式展现中国上下五千年历史，史料详实，叙事生动。从远古文明到近代变革，多角度解读历史事件和人物，配有珍贵历史图片。"
    },
    { 
        title: "前端开发实战", 
        author: "张三", 
        category: "技术", 
        price: 68, 
        cover: "25d81ae1-89f5-47af-bee0-06eaf27a30bf.jpg",
        rating: "4.9分 (1500+评价)",
        desc: "深入浅出地解释计算机前端开发理论与实战案例。涵盖HTML5、CSS3、JavaScript、Vue、React等主流技术，配套实战项目源码。"
    },
    { 
        title: "百年孤独", 
        author: "加西亚·马尔克斯", 
        category: "文学", 
        price: 59, 
        cover: "cb761d3f55e34cd0859b4218d34b417e~tplv-be4g95zd3a-image (1).jpeg",
        rating: "4.9分 (2000+评价)",
        desc: "魔幻现实主义文学的代表作，讲述布恩迪亚家族七代人的传奇故事。荣获诺贝尔文学奖，被翻译成40多种语言，全球销量超5000万册。"
    },
    { 
        title: "人工智能时代", 
        author: "李四", 
        category: "科普", 
        price: 79, 
        cover: "https://picsum.photos/id/5/200/300",
        rating: "4.7分 (950+评价)",
        desc: "解读人工智能的发展历程与未来趋势，从技术、伦理、社会等多维度分析AI对人类生活的影响。"
    }
];

// 图书构造函数（扩展用）
function Book(title, author, category, price, cover, rating, desc) {
    this.title = title;
    this.author = author;
    this.category = category;
    this.price = price;
    this.cover = cover;
    this.rating = rating;
    this.desc = desc;
}

// ===================== 3. 用户对象（管理登录/购物车） =====================
function User(username) {
    this.username = username;
    this.isLogin = false;
    this.cart = [];
    
    // 加入购物车方法
    this.addToCart = function(book) {
        this.cart.push(book);
        alert(`《${book.title}》已加入购物车！当前购物车数量：${this.cart.length}`);
    };
    
    // 退出登录方法
    this.logout = function() {
        this.username = "";
        this.isLogin = false;
        this.cart = [];
    };
}

// 初始化当前用户
let currentUser = new User("");

// ===================== 4. 智能搜索功能 =====================
const searchInput = document.getElementById('searchInput');
const searchTypeRadios = document.querySelectorAll('input[name="searchType"]');
const searchResults = document.getElementById('searchResults');

// 搜索输入监听
searchInput.addEventListener('input', function() {
    const keyword = this.value.trim().toLowerCase();
    // 清空搜索结果
    searchResults.innerHTML = "";
    
    // 无关键词时直接返回
    if (!keyword) return;
    
    // 获取选中的搜索类型（书名/作者/分类）
    const searchType = [...searchTypeRadios].find(r => r.checked).value;
    
    // 筛选匹配的图书
    const filteredBooks = bookList.filter(book => {
        return book[searchType].toLowerCase().includes(keyword);
    });
    
    // 渲染搜索结果
    if (filteredBooks.length > 0) {
        filteredBooks.forEach(book => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.innerHTML = `
                <img src="${book.cover}" alt="${book.title}" class="search-result-img">
                <div>
                    <h4>${book.title}</h4>
                    <p>作者：${book.author} | 分类：${book.category} | ¥${book.price}</p>
                </div>
            `;
            // 点击搜索结果选中图书（可扩展跳转/详情）
            item.addEventListener('click', () => {
                alert(`你选中了《${book.title}》`);
                searchResults.innerHTML = "";
                searchInput.value = book.title;
            });
            searchResults.appendChild(item);
        });
    } else {
        searchResults.innerHTML = '<div style="padding: 10px; color: #999;">未找到匹配的图书</div>';
    }
});

// 点击页面空白处关闭搜索结果
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.innerHTML = "";
    }
});

// ===================== 5. 登录/注册模态框逻辑 =====================
// 获取模态框元素
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const showLoginBtn = document.getElementById('showLoginBtn');
const showRegisterBtn = document.getElementById('showRegisterBtn');
const closeLoginModal = document.getElementById('closeLoginModal');
const closeRegisterModal = document.getElementById('closeRegisterModal');
const goToRegister = document.getElementById('goToRegister');
const goToLogin = document.getElementById('goToLogin');
const authButtons = document.getElementById('authButtons');
const userStatus = document.getElementById('userStatus');
const usernameDisplay = document.getElementById('username');
const logoutBtn = document.getElementById('logoutBtn');

// 显示登录模态框
showLoginBtn.addEventListener('click', () => {
    loginModal.classList.add('show');
});

// 显示注册模态框
showRegisterBtn.addEventListener('click', () => {
    registerModal.classList.add('show');
});

// 关闭登录模态框
closeLoginModal.addEventListener('click', () => {
    loginModal.classList.remove('show');
});

// 关闭注册模态框
closeRegisterModal.addEventListener('click', () => {
    registerModal.classList.remove('show');
});

// 登录页跳注册
goToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.classList.remove('show');
    registerModal.classList.add('show');
});

// 注册页跳登录
goToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.classList.remove('show');
    loginModal.classList.add('show');
});

// 点击模态框外部关闭
window.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.classList.remove('show');
    if (e.target === registerModal) registerModal.classList.remove('show');
});

// ===================== 6. 表单验证（登录 + 注册） =====================
// 正则表达式：邮箱/手机号验证
const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const phoneReg = /^1[3-9]\d{9}$/;

// 登录表单验证
const loginForm = document.getElementById('loginForm');
const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const loginUsernameError = document.getElementById('loginUsernameError');
const loginPasswordError = document.getElementById('loginPasswordError');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // 验证用户名（邮箱/手机号）
    if (!emailReg.test(loginUsername.value) && !phoneReg.test(loginUsername.value)) {
        loginUsernameError.classList.add('show');
        isValid = false;
    } else {
        loginUsernameError.classList.remove('show');
    }

    // 验证密码
    if (loginPassword.value.trim() === "") {
        loginPasswordError.classList.add('show');
        isValid = false;
    } else {
        loginPasswordError.classList.remove('show');
    }

    // 验证通过则登录
    if (isValid) {
        currentUser.username = loginUsername.value.split('@')[0] || loginUsername.value;
        currentUser.isLogin = true;
        // 更新页面显示
        authButtons.style.display = 'none';
        userStatus.style.display = 'flex';
        usernameDisplay.textContent = currentUser.username;
        loginModal.classList.remove('show');
        alert(`登录成功！欢迎你，${currentUser.username}！`);
        // 重置表单
        loginForm.reset();
    }
});

// 注册表单验证 + 密码强度检测
const registerForm = document.getElementById('registerForm');
const regUsername = document.getElementById('regUsername');
const regPassword = document.getElementById('regPassword');
const regUsernameError = document.getElementById('regUsernameError');
const regPasswordError = document.getElementById('regPasswordError');
const passwordStrength = document.querySelector('.password-strength');

// 密码强度检测
regPassword.addEventListener('input', () => {
    const pwd = regPassword.value;
    let strength = '';
    let color = '';

    if (pwd.length === 0) {
        passwordStrength.textContent = '';
        return;
    } else if (pwd.length < 6) {
        strength = '密码长度不足（至少6位）';
        color = '#e74c3c';
    } else if (pwd.length < 8) {
        strength = '弱密码（建议包含大小写/数字/符号）';
        color = '#f39c12';
    } else if (/^[a-z0-9]+$/.test(pwd) || /^[A-Z0-9]+$/.test(pwd)) {
        strength = '中密码（建议增加符号/大小写）';
        color = '#f1c40f';
    } else {
        strength = '强密码（安全）';
        color = '#2ecc71';
    }

    passwordStrength.textContent = strength;
    passwordStrength.style.color = color;
});

// 注册表单提交验证
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // 验证用户名（邮箱/手机号）
    if (!emailReg.test(regUsername.value) && !phoneReg.test(regUsername.value)) {
        regUsernameError.classList.add('show');
        isValid = false;
    } else {
        regUsernameError.classList.remove('show');
    }

    // 验证密码
    if (regPassword.value.trim() === "" || regPassword.value.length < 6) {
        regPasswordError.classList.add('show');
        isValid = false;
    } else {
        regPasswordError.classList.remove('show');
    }

    // 验证通过则注册 + 自动登录
    if (isValid) {
        currentUser.username = regUsername.value.split('@')[0] || regUsername.value;
        currentUser.isLogin = true;
        // 更新页面显示
        authButtons.style.display = 'none';
        userStatus.style.display = 'flex';
        usernameDisplay.textContent = currentUser.username;
        registerModal.classList.remove('show');
        alert(`注册并订阅成功！欢迎你，${currentUser.username}！`);
        // 重置表单
        registerForm.reset();
        passwordStrength.textContent = '';
    }
});

// ===================== 7. 退出登录功能 =====================
logoutBtn.addEventListener('click', () => {
    currentUser.logout();
    // 更新页面显示
    authButtons.style.display = 'flex';
    userStatus.style.display = 'none';
    alert('已退出登录！');
});

// ===================== 8. 加入购物车/立即购买功能 =====================
const addToCartBtns = document.querySelectorAll('.add-to-cart');
const buyNowBtns = document.querySelectorAll('.buy-now');

// 加入购物车按钮绑定
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 未登录则提示登录
        if (!currentUser.isLogin) {
            alert('请先登录后再加入购物车！');
            loginModal.classList.add('show');
            return;
        }
        // 获取图书信息
        const bookTitle = btn.dataset.book;
        const bookPrice = parseFloat(btn.dataset.price);
        const book = bookList.find(b => b.title === bookTitle);
        // 加入购物车
        currentUser.addToCart(book);
    });
});

// 立即购买按钮绑定
buyNowBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 未登录则提示登录
        if (!currentUser.isLogin) {
            alert('请先登录后再购买！');
            loginModal.classList.add('show');
            return;
        }
        const bookTitle = btn.dataset.book;
        const bookPrice = parseFloat(btn.dataset.price);
        alert(`你已下单《${bookTitle}》，价格：¥${bookPrice.toFixed(2)}，请前往结算！`);
    });
});

// ===================== 9. 页面初始化 =====================
window.addEventListener('load', () => {
    // 初始化轮播图位置
    updateSlidePosition();
    // 重置所有表单
    loginForm.reset();
    registerForm.reset();
    // 隐藏错误提示
    document.querySelectorAll('.form-error').forEach(el => el.classList.remove('show'));
});