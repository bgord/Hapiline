const Habit = use("Habit");
const VALIDATION_MESSAGES = use("VALIDATION_MESSAGES");
const Database = use("Database");
const datefns = require("date-fns");
const HABIT_VOTE_TYPES = use("HABIT_VOTE_TYPES");
const {
	NextGreatestUserHabitOrderCalculator,
} = require("../../Beings/NextGreatestUserHabitOrderCalculator");

class HabitsController {
	async store({request, response, auth}) {
		const newHabitPayload = request.only([
			"name",
			"score",
			"strength",
			"user_id",
			"description",
			"is_trackable",
		]);

		try {
			const nextOrderCalculator = new NextGreatestUserHabitOrderCalculator({
				userId: auth.user.id,
			});

			const order = await nextOrderCalculator.calculate();

			const result = await Habit.create({
				...newHabitPayload,
				order,
			});

			return response.status(201).send(result);
		} catch (error) {
			if (error.message.includes("duplicate key value violates unique constraint")) {
				return response.validationError({
					argErrors: [
						{
							message: VALIDATION_MESSAGES.unique_habit,
							field: "name",
							validation: "unique",
						},
					],
				});
			}
			throw error;
		}
	}

	async index({response, auth}) {
		const result = await auth.user
			.habits()
			.orderBy("order")
			.fetch();

		return response.send(result);
	}

	async show({params, response, auth}) {
		const habit = await Database.table("habits")
			.where("id", params.id)
			.first();

		if (!habit) return response.notFound();
		if (habit.user_id !== auth.user.id) return response.accessDenied();

		if (!habit.is_trackable) {
			return response.send({
				...habit,
				progress_streak: 0,
				regress_streak: 0,
			});
		}

		const votes = await getVotesForHabit(habit);

		const progress_streak = getVoteTypeStreak(HABIT_VOTE_TYPES.progress, votes);
		const regress_streak = getVoteTypeStreak(HABIT_VOTE_TYPES.regress, votes);

		return response.send({
			...habit,
			progress_streak,
			regress_streak,
		});
	}

	async delete({params, response, auth}) {
		try {
			const deletedItemsCounter = await auth.user
				.habits()
				.where({id: params.id})
				.delete();

			if (!deletedItemsCounter) throw error;
			return response.send();
		} catch (error) {
			return response.accessDenied();
		}
	}

	async update({request, response, params, auth}) {
		const payload = request.only(["name", "score", "strength", "description"]);

		const habit = await Habit.find(params.id);

		if (habit.user_id !== auth.user.id) return response.accessDenied();

		try {
			await habit.merge(payload);
			await habit.save();

			const habitVotes = await Database.select("vote", "day")
				.from("habit_votes")
				.where({
					habit_id: habit.id,
				})
				.orderBy("day");

			const days = datefns
				.eachDayOfInterval({
					start: new Date(habit.created_at),
					end: new Date(),
				})
				.map(day => {
					const dayVote = habitVotes.find(vote => datefns.isSameDay(vote.day, day));
					return {
						day,
						vote: dayVote ? dayVote.vote : null,
					};
				});

			const votes = [...days].reverse().map(day => day.vote);

			const progress_streak = getVoteTypeStreak(HABIT_VOTE_TYPES.progress, votes);
			const regress_streak = getVoteTypeStreak(HABIT_VOTE_TYPES.regress, votes);

			return response.send({
				...habit.toJSON(),
				progress_streak,
				regress_streak,
			});
		} catch (error) {
			if (error.message.includes("duplicate key value violates unique constraint")) {
				return response.validationError({
					argErrors: [
						{
							message: VALIDATION_MESSAGES.unique_habit,
							field: "name",
							validation: "unique",
						},
					],
				});
			}
			throw error;
		}
	}
}

module.exports = HabitsController;

function getVoteTypeStreak(type, votes) {
	let streak = 0;

	for (const [index, vote] of votes.entries()) {
		if (index === 0 && vote !== HABIT_VOTE_TYPES[type]) {
			break;
		} else if (vote === HABIT_VOTE_TYPES[type]) {
			streak++;
		} else break;
	}

	return streak;
}

async function getVotesForHabit(habit) {
	const habitVotes = await Database.select("vote", "day")
		.from("habit_votes")
		.where({
			habit_id: habit.id,
		})
		.orderBy("day");

	const days = datefns
		.eachDayOfInterval({
			start: new Date(habit.created_at),
			end: new Date(),
		})
		.map(day => {
			const dayVote = habitVotes.find(vote => datefns.isSameDay(vote.day, day));
			return {
				day,
				vote: dayVote ? dayVote.vote : null,
			};
		});

	return [...days].reverse().map(day => day.vote);
}
