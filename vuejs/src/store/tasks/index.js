import { taskHelper } from '@/misc/task_helper'

const state = {
    tasks: [],
    taskName: '',
    taskFile: null,
    taskStep: "",
    taskCreationPending: false
}


const actions = {
    getTasks: async ({ commit, dispatch, rootState }) => {
        taskHelper.getTasks(rootState.authentication.user.token)
            .then(
                tasks => {
                    commit('setTasks', tasks)
                },
                error => {
                    commit('setTasks', [])
                    dispatch('authentication/logout', error, {root: true})
                    console.error("get tasks",error)
                }
            )

    },
    createTask: async ({ commit, dispatch, rootState }, task) => {
        commit('setTaskCreationPending', true)
        taskHelper.createTask(task, rootState.authentication.user.token)
            .then(
                createdTask => {
                    commit('addTask', createdTask)
                    commit('setTaskCreationPending', false)
                    dispatch('alert/success', 'Task created!', { root: true });
                },
                error => {
                    commit('setTaskCreationPending', false)
                    console.error(error)
                    dispatch('alert/error', error, { root: true });
                    // TODO
                }
            )
    },
    /**
     * Update the task list by given task
     */
    updateTask: async({ commit, rootState }, updatedTask) => {
        const index = rootState.tasks.tasks.findIndex(task => task.id === updatedTask.id);
        if (index < 0) return;
        if (!rootState.tasks) return;
        const newTasks = rootState.tasks.tasks.slice(0);
        newTasks[index] = updatedTask;
        commit('setTasks', newTasks)
    },
    /**
     * Create a new task for current loggedin user and reset task inputs
    */
    triggerAddTaskAction: ({ dispatch, state, commit }) => {
        if (state.taskName === '') return
        if (state.taskFile === null) return
        if (state.taskStep === null) return
        const task = new FormData()
        task.append('data_filepath', state.taskFile)
        task.append('name', state.taskName)
        task.append('step', state.taskStep)
        commit('setTaskName', '')
        commit('setTaskFile', null)
        commit('setTaskStep', '')
        dispatch('createTask', task)
    },
}

const mutations = {
    setTaskName: (state, taskName) =>
        (state.taskName = taskName),
    setTaskFile: (state, taskFile) =>
        (state.taskFile = taskFile),
    setTaskStep: (state, taskStep) =>
        (state.taskStep = taskStep),
    setTasks: (state, tasks) => (state.tasks = tasks),
    addTask: (state, task) => state.tasks.push(task),
    // TODO start, stop task
    setTaskCreationPending: (state, value) =>
        (state.taskCreationPending = value)
}

const getters = {
    getTaskById: state => taskId => {
        const index = state.tasks.findIndex(task => task.id === taskId)
        return index >= 0 ? state.tasks[index]: null
    }

}


export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};