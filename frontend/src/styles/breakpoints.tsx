const sizes = {
	mobile: '576px',
	tablet: '768px',
	laptop: '992px',
	desktop: '1200px',
}

const Device = {
	mobile: `(min-width: ${sizes.mobile})`,
	tablet: `(min-width: ${sizes.tablet})`,
	laptop: `(min-width: ${sizes.laptop})`,
	desktop: `(min-width: ${sizes.desktop})`,
}

export default Device
