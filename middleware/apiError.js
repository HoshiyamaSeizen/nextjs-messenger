const apiError = (res, httpStatus, errorMessage = 'Error') => {
	return res.status(httpStatus).json({ msg: errorMessage });
};

export default apiError;
