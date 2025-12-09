<template>
    <div>
        <h1>News</h1>
        <p>This is the News view.</p>
        <ul>
            <li><RouterLink to="/news/1"> Item 1: Speedrun event announced!</RouterLink></li>
            <li><RouterLink to="/news/2"> Item 2: New features added to the platform.</RouterLink></li>
            <li><RouterLink to="/news/3"> Item 3: Community highlights of the week.</RouterLink></li>
        </ul>
        <RouterView/>
    </div>
</template>