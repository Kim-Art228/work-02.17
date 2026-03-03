const container = document.querySelector('#postsContainer');
const loader = document.querySelector('#loader');
const searchInput = document.querySelector('#searchInput');
const form = document.querySelector('#createPostForm');
const titleInput = document.querySelector('#postTitle');
const bodyInput = document.querySelector('#postBody');

let posts = [];

//loading posts on page load
document.addEventListener('DOMContentLoaded', loadPosts);

async function loadPosts() {
    loader.style.display = 'block';

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) throw new Error('error loading posts');

        posts = await response.json();
        posts = posts.slice(0, 10);

        renderPosts(posts);

    } catch (error) {
        container.innerHTML = `
            <div class="error-message">
                ⚠️ error loading posts
            </div>
        `;
    } finally {
        loader.style.display = 'none';
    }
}

// rendering posts
function renderPosts(postsArray) {
    container.innerHTML = '';

    postsArray.forEach(post => {
        const div = document.createElement('div');
        div.className = 'post-item';
        div.innerHTML = `
            <h4>${post.title}</h4>
            <p>${post.body}</p>
            <div class="comments"></div>
        `;

        // Кнопка комментариев
        const commentBtn = document.createElement('button');
        commentBtn.textContent = 'show comments';
        commentBtn.addEventListener('click', () => {
            showComments(post.id, commentBtn);
        });

        // Кнопка удаления
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'delete';
        deleteBtn.style.background = '#dc3545';
        deleteBtn.style.color = 'white';
        deleteBtn.addEventListener('click', () => {
            deletePost(post.id);
        });

        div.appendChild(commentBtn);
        div.appendChild(deleteBtn);

        container.appendChild(div);
    });
}

//comments
async function showComments(postId, btn) {
    const commentsContainer = btn
        .closest('.post-item')
        .querySelector('.comments');

    // Если уже загружены → просто скрыть
    if (commentsContainer.children.length > 0) {
        commentsContainer.classList.toggle('visible');
        return;
    }

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        if (!response.ok) throw new Error('error loading comments');

        const comments = await response.json();

        commentsContainer.innerHTML = comments.map(comment => `
            <div class="comment">
                <strong>${comment.name} (${comment.email})</strong>
                <p>${comment.body}</p>
            </div>
        `).join('');

        commentsContainer.classList.add('visible');

    } catch {
        commentsContainer.innerHTML = `
            <div class="error-message">
                error loading comments
            </div>
        `;
    }
}

//create post
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPost = {
        title: titleInput.value,
        body: bodyInput.value,
        userId: 1
    };

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPost)
        });

        if (!response.ok) throw new Error();

        const created = await response.json();

        posts.unshift(created);
        renderPosts(posts);

        alert(`post created! ID: ${created.id}`);

        form.reset();

    } catch (error) {
        alert('error creating post');
    }
});

//deleting post
async function deletePost(postId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error();

        posts = posts.filter(post => post.id !== postId);
        renderPosts(posts);

    } catch (error) {
        alert('error deleting post');
    }
}

//search
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();

    const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(query)
    );

    renderPosts(filtered);
});