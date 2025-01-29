// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    // Error testing code
    //   {
    //     id: 4,
    //     name: "Fake Assignment",
    //     due_at: "2023-02-15",
    //     points_possible: 0
    //   }
    ]
  };
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    },
    {
      learner_id: 136,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-03",
        score: 120
      }
    },
    {
        learner_id: 136,
        assignment_id: 3,
        submission: {
          submitted_at: "2023-03-03",
          score: 600
      }
    }
  ];

  function filterDueDate(assignments){
    const today = new Date();
    return assignments.filter(assignment => new Date(assignment.due_at) < today);
  }

  function calculateAverage(scores, assignments){
    let weightedAvg = 0;
    let total = 0;
    assignments.forEach(assignment => {
        if(scores[assignment.id] !== undefined){
            weightedAvg += assignment.points_possible * (scores[assignment.id]/100);
            total += assignment.points_possible;
        }
    });
    return (weightedAvg/total) * 100;
  }

  function calculateScore(submissions, assignments){
    let scores = {};
    assignments.forEach(assignment => {
        let submissionSearch = submissions.find(x => x.assignment_id === assignment.id);
        if(submissionSearch){
            let submissionScore = submissionSearch.submission.score;
            if(new Date(submissionSearch.submission.submitted_at) > new Date(assignment.due_at)){
                submissionScore -= assignment.points_possible * 0.1;
            }
            scores[assignment.id] = (submissionScore/assignment.points_possible) * 100;
        }
    });
    return scores;
  }

  function validate(course, assignGroup){
    assignGroup.assignments.forEach(assignment => {
        if(assignment.points_possible === 0){
            throw new Error(`Assignment cannot have 0 possible points: ${assignment.id}`);
        }
    });
    if(assignGroup.course_id !== course.id){
        throw new Error(`Assignment does not belong in the Course of ${course.id}: ${assignment.id}`);
    }
  }
  

  function getLearnerData(course, assignGroup, submissions) {
    try{
        validate(course, assignGroup);
        const filteredAssignments = filterDueDate(assignGroup.assignments);
        const students = {};
        submissions.forEach(submission => {
            if(!students[submission.learner_id]){
                students[submission.learner_id] = {
                    id: submission.learner_id,
                    scores: {}
                };
            }
            students[submission.learner_id].scores = calculateScore(submissions.filter(x => x.learner_id === submission.learner_id), filteredAssignments);
        });
        let results = Object.values(students).map(student => {
            let studentScores = student.scores;
            let studentAverage = calculateAverage(studentScores, filteredAssignments);
            return {
                id: student.id,
                avg: studentAverage,
                ...studentScores
            };
        });
        return results;
    } catch (error){
        console.error(`There was an error in processing the data: ${error.message}`);
        return [];
    }
  }
  
  console.log(getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions));