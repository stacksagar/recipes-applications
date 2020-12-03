const fixedName = document.querySelector('.fixedName');
const fnUsername = fixedName.classList[1];
fixedName.innerHTML = `<a href="https://github.com/${fnUsername}">
<i class="fab fa-github"></i><b class="autoWriteBreak 500">stacksagar</b>
</a>`;

document.addEventListener('DOMContentLoaded', () => {
	const fixedNameA = document.querySelector('.fixedName a');
	setTimeout(() => {
		fixedNameA.classList.add('username');
	}, 5000);
	setTimeout(() => {
		fixedNameA.classList.add("unsetUsername")
	}, 15000);
});
