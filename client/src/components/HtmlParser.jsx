import React from "react";

import parse from "html-react-parser";
import DOMPurify from "dompurify";

export default function HtmlParser({ htmlString }) {
	// const htmlStringTest = '<p>Some <script>alert("Hello!");</script> text</p>'; // Example HTML string with potentially unsafe content
	// const htmlString = jobPostDesc;

	const sanitizedHtml = DOMPurify.sanitize(htmlString);

	return parse(sanitizedHtml);
}
