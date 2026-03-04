import React from 'react'
import { Link } from 'react-router-dom'

const CategoryItems = ({ category }) => {
	return (
		<div className="relative overflow-hidden h-80 w-full rounded-2xl group cursor-pointer">
			<Link to={"/category" + category.href}>
				<div className="w-full h-full">
					{/* Image */}
					<img
						src={category.imageUrl}
						alt={category.name}
						className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
						loading="lazy"
					/>
					{/* Gradient Overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

					{/* Glass border glow on hover */}
					<div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-sky-400/30 transition-all duration-500" />

					{/* Content */}
					<div className="absolute bottom-0 left-0 right-0 p-5 z-20">
						<h3 className="text-white text-xl font-bold mb-1 group-hover:text-sky-300 transition-colors duration-300">
							{category.name}
						</h3>
						<div className="flex items-center gap-2">
							<p className="text-slate-400 text-sm">Explore {category.name}</p>
							<span className="text-sky-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">→</span>
						</div>
						{/* Animated underline */}
						<div className="w-0 h-0.5 bg-gradient-to-r from-sky-400 to-indigo-400 group-hover:w-12 transition-all duration-500 mt-2 rounded-full" />
					</div>
				</div>
			</Link>
		</div>
	);
}

export default CategoryItems