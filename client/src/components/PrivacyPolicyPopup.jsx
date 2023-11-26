import React, { useState } from "react";
import { Link } from "react-router-dom";

import btn from "./btn.module.css";

export default function PrivacyPolicyPopup() {
	return (
		<div className="privacy-policy-popup">
			<p
				className="a-text"
				data-bs-toggle="modal"
				data-bs-target="#exampleModal"
			>
				นโยบายความเป็นส่วนตัว
			</p>

			<div
				className="modal fade"
				id="exampleModal"
				tabIndex={-1}
				aria-labelledby="exampleModalLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
					<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5" id="exampleModalLabel">
								นโยบายความเป็นส่วนตัว
							</h1>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<div className="modal-body">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam
							nam et, nobis molestias, esse voluptas iure provident dolore
							praesentium quis quibusdam, culpa illum alias mollitia ab ducimus.
							Minima nulla soluta veniam sapiente voluptates culpa impedit
							nesciunt delectus, ipsum vel eum accusantium neque consequuntur
							quod adipisci. Quidem eaque nam, commodi porro maxime vitae
							laboriosam eos dolores quis ut molestiae dolorum provident,
							perferendis exercitationem? Ducimus quas itaque assumenda a nemo
							laborum exercitationem, dolorum ratione quos expedita non quam
							numquam! Aliquam commodi, cumque dolore eveniet a ex voluptates in
							aut tenetur voluptatibus, fugit id quaerat? Reprehenderit itaque
							unde voluptatibus, laborum sunt consequatur fugit adipisci cumque
							tenetur placeat ratione nesciunt omnis amet consectetur sint
							reiciendis officia ab suscipit in mollitia ea veritatis.
							Laboriosam vero beatae iste enim facilis eos commodi nesciunt
							aliquid at quisquam esse eligendi, fugit ad saepe quae pariatur
							dolorem possimus, facere quas veniam? Ab, non minima id nostrum
							accusamus cum impedit vero ducimus, neque excepturi mollitia
							beatae rem cupiditate, corporis eum veritatis officia voluptatem
							iusto accusantium. Facere consequuntur dolores illum aut
							distinctio eos optio, est nam doloribus repudiandae minima
							eligendi, iure saepe repellat nostrum porro voluptatibus dolorem
							error. Distinctio id quisquam ea perspiciatis asperiores iste sint
							fugiat quia velit ratione error dolorum soluta totam quae, nihil
							beatae, dignissimos sit pariatur! Odio rerum possimus officia quis
							fugit ullam non amet similique voluptas illum accusamus, omnis
							culpa hic repellat maxime sint minus facere ex ipsum tenetur
							magni. Voluptatibus quibusdam consequuntur quas autem odio
							cupiditate ducimus totam expedita modi neque atque aliquid, magnam
							quod officia ab. Sed delectus nihil ab ipsum? Inventore dolorum
							necessitatibus dicta accusantium, explicabo, quo quasi officia
							velit consequatur debitis aut aliquam delectus quaerat nobis ipsam
							at! Porro molestias dolores ipsam aliquid ea dignissimos, quidem,
							deserunt nostrum natus, non ex velit facere. Ipsam ipsum iure
							distinctio. Illum ad magni dolorum suscipit rem pariatur, vero in
							repellat quia perferendis quis inventore a, iure saepe odio
							blanditiis fugiat voluptates, recusandae quae unde eum aperiam?
							Labore dolore nobis doloremque repellat culpa voluptas sit eaque
							aliquid et id consequuntur nostrum porro fugit, numquam suscipit
							ullam autem cupiditate a impedit, laboriosam nisi! Exercitationem
							enim ex perferendis ut odio? Vel facilis maxime numquam dolore,
							pariatur quis dolores hic a perspiciatis in? Rerum quas porro, qui
							voluptatum soluta temporibus aspernatur culpa facilis ea nostrum
							beatae debitis nam tempore maiores similique. Corrupti, quis sit.
							Nesciunt accusantium, laboriosam hic mollitia provident blanditiis
							amet neque consectetur ratione, corrupti, vero consequuntur fuga!
							Exercitationem reiciendis tenetur quaerat expedita, doloribus quas
							illum eum fugiat vitae necessitatibus laborum. Corrupti provident
							commodi facere illum, harum ab eos? Odio eaque facilis, commodi
							maxime dignissimos aspernatur esse obcaecati suscipit quae nulla
							deleniti? Perferendis inventore a quod ratione, dolor ipsa tempore
							ex tempora provident beatae, molestias eius nihil esse eos! Vero
							exercitationem iusto quod voluptatem deserunt iure qui aspernatur
							incidunt expedita odit doloribus, impedit voluptatibus unde amet
							consequatur odio nihil quam, autem culpa inventore cumque,
							necessitatibus possimus accusamus. Neque enim ipsum sit, esse
							delectus qui id necessitatibus quaerat ratione eos quia totam
							dolores molestias minus temporibus nobis reiciendis nemo.
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className={`${btn.btn_grey}`}
								data-bs-dismiss="modal"
							>
								ปิด
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
