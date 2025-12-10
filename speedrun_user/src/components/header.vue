<template>
    <header class="container">
        <div class="options">
            <div class="logo">
                <img src="../assets/logo_speedrun.png" alt="Speedrun Logo" width="auto" height="55">
            </div>
            <div class="nav">
                <button>Games</button>
                <button>Challanges</button>
                <button>Forums</button>
                <button>Help</button>
            </div>

            <div class="user-menu-wrapper">
                <div class="search-container">
                    <svg class="search-icon" viewBox="0 0 24 24">
                        <path d="M21.71 20.29l-5.01-5.01C17.54 13.68 18 11.91 18 10c0-4.41-3.59-8-8-8S2 5.59 2 10s3.59 8 8 8c1.91 0 3.68-.46 5.28-1.3l5.01 5.01c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                    </svg>
                    <input 
                        type="text" 
                        placeholder="Search page..." 
                        v-model="searchText"
                        @input="handleSearch"
                    >
                </div>

                <div class="user-avatar-trigger" @click="toggleDropdown">
                    <img src="../assets/avatar.png" alt="User Avatar" class="user-avatar">
                    <svg viewBox="0 0 20 20" fill="currentColor" class="chevron-down">
                        <path fill-rule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                    </svg>
                </div>

                <transition name="fade">
                    <div class="user-dropdown" v-if="showDropdown">
                        <div class="dropdown-item user-profile">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M12 4a4 4 0 100 8 4 4 0 000-8zm-2 9a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span class="username">Limpid</span>
                        </div>
                        <div class="dropdown-item">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M4 12c0 4.418 3.582 8 8 8s8-3.582 8-8-3.582-8-8-8-8 3.582-8 8zm9 0V7h2v5h3l-4 4-4-4h3z" />
                            </svg>
                            Support tickets
                        </div>
                        <div class="dropdown-item">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M19.95 11.23c-.15-.49-.49-.89-.95-1.07s-.98-.22-1.45-.06l-1.87.57a.5.5 0 00-.39.46v2.54c0 .32.22.6.53.66l1.87.57c.47.16.96.11 1.45-.06s.8-.58.95-1.07l.7-2.34a.5.5 0 00-.05-.44l-.7-.03zM12 4a8 8 0 100 16A8 8 0 0012 4zm0 2c3.314 0 6 2.686 6 6s-2.686 6-6 6-6-2.686-6-6 2.686-6 6-6z" />
                            </svg>
                            Settings
                        </div>
                        <div class="dropdown-item">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M12 14.75l-4.75 2.5 1.25-5.35-4.1-3.6 5.4-.5 2.25-5.05 2.25 5.05 5.4.5-4.1 3.6 1.25 5.35L12 14.75z" />
                            </svg>
                            Supporter
                        </div>
                        <div class="dropdown-item sign-out">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M16 17v-3h-4v-2h4V9l5 4-5 4zm-9 3a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v1h-2V6H7v12h8v-1h2v1a2 2 0 01-2 2H7z" />
                            </svg>
                            Sign out
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </header>
</template>

<script>
import { ref } from 'vue';

export default {
    name: 'headers',
    setup() {
        const showDropdown = ref(false);
        const searchText = ref('');

        const toggleDropdown = () => {
            showDropdown.value = !showDropdown.value;
        };

        const handleSearch = () => {

            clearHighlights();

            const query = searchText.value.trim();
            if (!query) return;

            highlightTextInNode(document.body, query);
        };

        const clearHighlights = () => {
            const highlights = document.querySelectorAll('.speedrun-highlight');
            highlights.forEach(span => {
                const parent = span.parentNode;
                parent.replaceChild(document.createTextNode(span.textContent), span);
                parent.normalize(); 
            });
        };

        const highlightTextInNode = (root, text) => {
            const regex = new RegExp(`(${text})`, 'gi');

            const walker = document.createTreeWalker(
                root, 
                NodeFilter.SHOW_TEXT, 
                {
                    acceptNode: (node) => {
                        if (node.parentElement.closest('header') || 
                            node.parentElement.tagName === 'SCRIPT' || 
                            node.parentElement.tagName === 'STYLE') {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            const nodesToReplace = [];
            while (walker.nextNode()) {
                const node = walker.currentNode;
                if (node.nodeValue.match(regex)) {
                    nodesToReplace.push(node);
                }
            }


            nodesToReplace.forEach(node => {
                const fragment = document.createDocumentFragment();
                let lastIdx = 0;
                node.nodeValue.replace(regex, (match, p1, offset) => {

                    fragment.appendChild(document.createTextNode(node.nodeValue.slice(lastIdx, offset)));
                    
                    const span = document.createElement('span');
                    span.className = 'speedrun-highlight';
                    span.textContent = match;
                    fragment.appendChild(span);
                    
                    lastIdx = offset + match.length;
                    return match;
                });

                fragment.appendChild(document.createTextNode(node.nodeValue.slice(lastIdx)));
                
                node.parentNode.replaceChild(fragment, node);
            });
        };

        return {
            showDropdown,
            toggleDropdown,
            searchText,
            handleSearch
        };
    }
}
</script>

<style>

.speedrun-highlight {
    background-color: #ffeb3b;
    color: #000;
    font-weight: bold;
    border-radius: 2px;
    box-shadow: 0 0 2px rgba(255, 235, 59, 0.8);
}
</style>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 64px;
    background-color: #ABCAD1;
    padding: 0 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 100;
}

.options {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70%;
    height: 100%;
}

.logo {
    height: 100%;
    display: flex;
    align-items: center;
}

.nav {
    display: flex;
    align-items: center;
    font: 16px Arial, sans-serif;
    justify-content: flex-start;
    flex-grow: 1;
    padding: 0 30px;
}

.nav button {
    background: none;
    border: none;
    margin: 0 12px;
    font-size: 18px;
    cursor: pointer;
    color: #333;
    padding: 8px 14px;
    border-radius: 8px;
    transition: background 0.2s, box-shadow 0.2s;
}

.nav button:hover {
    background: rgba(0, 0, 0, 0.08);  /* 浅灰 */
    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.12);  /* 轻边框 */
}

.user-menu-wrapper {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
}

.search-container {
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 5px;
    padding: 5px 10px;
    margin-right: 15px;
    height: 40px;
    width: auto;
    transition: all 0.2s;
}

.search-container:focus-within {
    background-color: #fff;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
}

.search-icon {
    width: 18px;
    height: 18px;
    fill: #555;
    margin-right: 5px;
}

.search-container input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 14px;
    width: 120px; /* 初始宽度 */
    transition: width 0.2s;
}

.search-container input:focus {
    width: 160px; /* 聚焦时变宽 */
}

/* --- 头像触发器 --- */
.user-avatar-trigger {
    display: flex;
    align-items: center;
    padding: 4px 8px; /* 稍微调小 padding 看起来更精致 */
    border-radius: 999px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.user-avatar-trigger:hover {
    background-color: rgba(255, 255, 255, 0.3);
}

.user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 5px;
    border: 2px solid #FFF; /* 加粗边框 */
}

.chevron-down {
    width: 16px;
    height: 16px;
    color: #333;
}

/* --- 修复：下拉菜单定位 --- */
.user-dropdown {
    position: absolute;
    /* 关键修复：不再使用 top: 150px */
    top: calc(100% + 10px); /* 100% 是父元素底部，+10px 是间距 */
    right: 0; /* 对齐右边缘 */
    min-width: 220px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    padding: 8px 0;
    overflow: hidden;
}

/* 添加一个小三角形指向头像 (可选) */
.user-dropdown::before {
    content: '';
    position: absolute;
    top: -6px;
    right: 20px;
    width: 12px;
    height: 12px;
    background-color: #fff;
    transform: rotate(45deg);
    box-shadow: -2px -2px 5px rgba(0,0,0,0.05);
}

.dropdown-item {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    cursor: pointer;
    font-size: 15px;
    color: #444;
    transition: background-color 0.1s;
}

.dropdown-item:hover {
    background-color: #f5f7fa;
    color: #000;
}

.dropdown-item .icon {
    width: 18px;
    height: 18px;
    margin-right: 12px;
    fill: #888;
}

.dropdown-item:hover .icon {
    fill: #333;
}

.user-profile {
    font-weight: 600;
    color: #2c3e50;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 12px;
    margin-bottom: 5px;
}

.sign-out {
    margin-top: 5px;
    border-top: 1px solid #eee;
    padding-top: 12px;
    color: #e74c3c;
}

.sign-out .icon {
    fill: #e74c3c;
}

/* 简单的淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>