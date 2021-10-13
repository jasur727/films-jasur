var normalizeDate = function (format) {
	var date = new Date(format);
	var year = date.getFullYear();
	var month = String(date.getMonth() + 1).padStart(2, 0);
	var day = String(date.getDate()).padStart(2, 0);

	return day + '.' + month + '.' + year;
};
