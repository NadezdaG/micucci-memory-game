<template>
	<div
		class="spinner"
		:class="{
			active: this.loading,
		}"
	>
		<div class="spinner__inner">
			<div>
				<div>
					<div>
						<div>
							<div>
								<div>
									<div></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: "spinner",
	props: ["loading"],
};
</script>
<style lang="scss">
@use "../assets/scss/_variables.scss";
.spinner {
	position: absolute;
	width: 100%;
	height: 100%;
	display: none;
    top: 0;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	&.active {
		display: flex;
	}

	&__inner {
		display: block;
		position: relative;
		width: 150px;
		height: 150px;

		div {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			margin: auto;
			height: 90%;
			font-size: 20px;
			width: 90%;
			margin: auto auto;
			border-radius: 50%;
			border-right: 9px solid variables.$color-gold;
			animation: spinning 20s linear infinite;
		}
	}
}

@keyframes spinning {
	0% {
		transform: rotate(0deg);
		border-right: 9px solid rgba(variables.$color-gold, 0.6);
	}
	5% {
		border-right-color: rgba(variables.$color-gold, 0.4);
	}
	10% {
		border-right-color: rgba(variables.$color-gold, 0.6);
	}
	15% {
		border-right-color: rgba(variables.$color-gold, 0.4);
	}
	20% {
		border-right-color: rgba(variables.$color-gold, 0.6);
	}
	25% {
		border-right-color: rgba(variables.$color-gold, 0.4);
	}
	30% {
		border-right-color: rgba(variables.$color-gold, 0.6);
	}
	35% {
		border-right-color: rgba(variables.$color-gold, 0.4);
	}
	40% {
		border-right-color: rgba(variables.$color-gold, 0.6);
	}
	45% {
		border-right-color: rgba(variables.$color-gold, 0.4);
	}
	50% {
		border-right-color: rgba(variables.$color-gold, 0.6);
	}
	55% {
		border-right-color: rgba(variables.$color-gold, 0.4);
	}
	60% {
		border-right-color: rgba(variables.$color-gold, 0.6);
	}
	65% {
		border-right-color: rgba(variables.$color-gold, 0.4);
	}
	70% {
		border-right-color: rgba(variables.$color-gold, 0.6);
	}
	75% {
		border-right-color: rgba(variables.$color-gold, 0.4);
	}
	80% {
		border-right-color: rgba(variables.$color-gold, 0.6);
	}
	85% {
		border-right-color: rgba(variables.$color-gold, 0.4);
	}
	90% {
		border-right-color: rgba(variables.$color-gold, 0.6);
	}
	95% {
		border-right-color: rgba(variables.$color-gold, 0.4);
	}
	100% {
		transform: rotate(360deg);
		border-right: 9px solid rgba(variables.$color-gold, 0.6);
	}
}
</style>