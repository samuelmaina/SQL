const utils = require("./utils");

const { ensureEqual, ensureDeeplyEqual } = require("./testUtils");

const { createConnectionAsync, createTableAsync } = utils;

const MAX_SETUP_TIME_IN_MS = 100000;
const MAX_TESTING_TIME_IN_MS = 30000;

describe("Intermediate SQL queries", () => {
  let connection;

  beforeAll(async () => {
    connection = await createConnectionAsync();
  }, MAX_SETUP_TIME_IN_MS);

  afterAll((done) => {
    connection.end(utils.cbWithDone(done));
  }, MAX_SETUP_TIME_IN_MS);

  describe("Different JOINS", () => {
    beforeAll(async () => {
      await utils.createTablesAndLoadThemWithData(connection);
    }, MAX_SETUP_TIME_IN_MS);

    afterAll(async () => {
      await utils.clearDbAsync(connection);
    }, MAX_SETUP_TIME_IN_MS);

    describe.skip("Natural Join", () => {
      //it will perform a catesian product of the two relations  and only
      //take those tuples with the same fields for all the common  columns
      //for all the relations in the join operation.
      //all the common columns are presented as one column in the resultant relation.
      //the result of natural join is a relation which can be placed and treated as
      //any other relation.

      //the select for natural join takes the format
      // select A1, A2,…, An
      //    from r1 natural join r2 natural join . . . natural join rm
      //    where P;

      it(
        "usage",
        async () => {
          const select = `select *
                            from student natural join takes;`;
          const result = await utils.runNonParametricQueryAsync(
            connection,
            select
          );

          const resultAsArray = result.map((tuple) => {
            const {
              ID,
              name,
              dept_name,
              tot_cred,
              course_id,
              sec_id,
              semester,
              year,
              grade,
            } = tuple;
            return [
              ID,
              name,
              dept_name,
              tot_cred,
              course_id,
              sec_id,
              semester,
              year,
              grade,
            ];
          });

          const expected = [
            [
              "00128",
              "Zhang",
              "Comp. Sci.",
              102,
              "CS-101",
              "1",
              "Fall",
              2017,
              "A",
            ],
            [
              "00128",
              "Zhang",
              "Comp. Sci.",
              102,
              "CS-347",
              "1",
              "Fall",
              2017,
              "A-",
            ],
            [
              "12345",
              "Shankar",
              "Comp. Sci.",
              32,
              "CS-101",
              "1",
              "Fall",
              2017,
              "C",
            ],
            [
              "12345",
              "Shankar",
              "Comp. Sci.",
              32,
              "CS-190",
              "2",
              "Spring",
              2017,
              "A",
            ],
            [
              "12345",
              "Shankar",
              "Comp. Sci.",
              32,
              "CS-315",
              "1",
              "Spring",
              2018,
              "A",
            ],
            [
              "12345",
              "Shankar",
              "Comp. Sci.",
              32,
              "CS-347",
              "1",
              "Fall",
              2017,
              "A",
            ],
            [
              "19991",
              "Brandt",
              "History",
              80,
              "HIS-351",
              "1",
              "Spring",
              2018,
              "B",
            ],
            [
              "23121",
              "Chavez",
              "Finance",
              110,
              "FIN-201",
              "1",
              "Spring",
              2018,
              "C+",
            ],
            [
              "44553",
              "Peltier",
              "Physics",
              56,
              "PHY-101",
              "1",
              "Fall",
              2017,
              "B-",
            ],
            ["45678", "Levy", "Physics", 46, "CS-101", "1", "Fall", 2017, "F"],
            [
              "45678",
              "Levy",
              "Physics",
              46,
              "CS-101",
              "1",
              "Spring",
              2018,
              "B+",
            ],
            [
              "45678",
              "Levy",
              "Physics",
              46,
              "CS-319",
              "1",
              "Spring",
              2018,
              "B",
            ],
            [
              "54321",
              "Williams",
              "Comp. Sci.",
              54,
              "CS-101",
              "1",
              "Fall",
              2017,
              "A-",
            ],
            [
              "54321",
              "Williams",
              "Comp. Sci.",
              54,
              "CS-190",
              "2",
              "Spring",
              2017,
              "B+",
            ],
            [
              "55739",
              "Sanchez",
              "Music",
              38,
              "MU-199",
              "1",
              "Spring",
              2018,
              "A-",
            ],
            [
              "76543",
              "Brown",
              "Comp. Sci.",
              58,
              "CS-101",
              "1",
              "Fall",
              2017,
              "A",
            ],
            [
              "76543",
              "Brown",
              "Comp. Sci.",
              58,
              "CS-319",
              "2",
              "Spring",
              2018,
              "A",
            ],
            [
              "76653",
              "Aoi",
              "Elec. Eng.",
              60,
              "EE-181",
              "1",
              "Spring",
              2017,
              "C",
            ],
            [
              "98765",
              "Bourikas",
              "Elec. Eng.",
              98,
              "CS-101",
              "1",
              "Fall",
              2017,
              "C-",
            ],
            [
              "98765",
              "Bourikas",
              "Elec. Eng.",
              98,
              "CS-315",
              "1",
              "Spring",
              2018,
              "B",
            ],
            [
              "98988",
              "Tanaka",
              "Biology",
              120,
              "BIO-101",
              "1",
              "Summer",
              2017,
              "A",
            ],
            [
              "98988",
              "Tanaka",
              "Biology",
              120,
              "BIO-301",
              "1",
              "Summer",
              2018,
              null,
            ],
          ];

          ensureDeeplyEqual(resultAsArray, expected);
        },
        MAX_TESTING_TIME_IN_MS
      );

      it(
        "more usage",
        async () => {
          //the result of the natural join are used as a relation to the
          //the cartesian operation of the from clause.
          //in this

          //query:List the names of students along with
          // the titles of courses that they have taken.
          const select = `select name, title
                            from student natural join takes, course
                            where takes.course_id = course.course_id;`;
          const result = await utils.runNonParametricQueryAsync(
            connection,
            select
          );

          const resultAsArray = result.map((tuple) => {
            const { name, title } = tuple;
            return [name, title];
          });

          const expected = [
            ["Zhang", "Intro. to Computer Science"],
            ["Zhang", "Database System Concepts"],
            ["Shankar", "Intro. to Computer Science"],
            ["Shankar", "Game Design"],
            ["Shankar", "Robotics"],
            ["Shankar", "Database System Concepts"],
            ["Brandt", "World History"],
            ["Chavez", "Investment Banking"],
            ["Peltier", "Physical Principles"],
            ["Levy", "Intro. to Computer Science"],
            ["Levy", "Intro. to Computer Science"],
            ["Levy", "Image Processing"],
            ["Williams", "Intro. to Computer Science"],
            ["Williams", "Game Design"],
            ["Sanchez", "Music Video Production"],
            ["Brown", "Intro. to Computer Science"],
            ["Brown", "Image Processing"],
            ["Aoi", "Intro. to Digital Systems"],
            ["Bourikas", "Intro. to Computer Science"],
            ["Bourikas", "Robotics"],
            ["Tanaka", "Intro. to Biology"],
            ["Tanaka", "Genetics"],
          ];

          ensureDeeplyEqual(resultAsArray, expected);
        },
        MAX_TESTING_TIME_IN_MS
      );
      it(
        "using the USING clause",
        async () => {
          //the using clause is used to specify
          //the common column that the natural join table should have
          //values in common.

          // The operation join … using requires a list of attribute names to be specified. Both
          // relations being joined must have attributes with the specified names. Consider the operation
          // r1 join r2 using(A1, A2). The operation is similar to r1 natural join r2, except that
          // a pair of tuples t1 from r1 and t2 from r2 match if t1.A1 = t2.A1 and t1.A2 = t2.A2; even
          // if r1 and r2 both have an attribute named A3, it is not required that t1.A3 = t2.A3.
          const select = `select name, title
                          from (student natural join takes) join course using (course_id);`;
          const result = await utils.runNonParametricQueryAsync(
            connection,
            select
          );

          const resultAsArray = result.map((tuple) => {
            const { name, title } = tuple;
            return [name, title];
          });

          ensureDeeplyEqual(resultAsArray, expected);
        },
        MAX_TESTING_TIME_IN_MS
      );
    });
    describe("JOIN using ON clause", () => {
      it(
        "using the ON clause",
        async () => {
          //this is type of join where a predicate like the one that is used
          //in the WHERE clause  of the From operation.
          const select = `select student.ID,name,dept_name
                          from student join takes on student.ID = takes.ID;`;
          const result = await utils.runNonParametricQueryAsync(
            connection,
            select
          );

          const resultAsArray = result.map((tuple) => {
            const { ID, name, dept_name } = tuple;
            return [ID, name, dept_name];
          });

          const expected = [
            ["00128", "Zhang", "Comp. Sci."],
            ["00128", "Zhang", "Comp. Sci."],
            ["12345", "Shankar", "Comp. Sci."],
            ["12345", "Shankar", "Comp. Sci."],
            ["12345", "Shankar", "Comp. Sci."],
            ["12345", "Shankar", "Comp. Sci."],
            ["19991", "Brandt", "History"],
            ["23121", "Chavez", "Finance"],
            ["44553", "Peltier", "Physics"],
            ["45678", "Levy", "Physics"],
            ["45678", "Levy", "Physics"],
            ["45678", "Levy", "Physics"],
            ["54321", "Williams", "Comp. Sci."],
            ["54321", "Williams", "Comp. Sci."],
            ["55739", "Sanchez", "Music"],
            ["76543", "Brown", "Comp. Sci."],
            ["76543", "Brown", "Comp. Sci."],
            ["76653", "Aoi", "Elec. Eng."],
            ["98765", "Bourikas", "Elec. Eng."],
            ["98765", "Bourikas", "Elec. Eng."],
            ["98988", "Tanaka", "Biology"],
            ["98988", "Tanaka", "Biology"],
          ];

          ensureDeeplyEqual(resultAsArray, expected);
        },
        MAX_TESTING_TIME_IN_MS
      );
    });

    describe("Outer joins", () => {
      //these operations allow  for those tuples that don't have
      //any matching values for common column to be preserved in the join operation.
      //the values that are not there are replaced by a null value  in the relation.
      describe("left outer join", () => {
        // The left outer join preserves tuples only in the relation named before (to the left
        //   of) the left outer join operation.
        //ensures that the values of the left relation is preserved for any non matching record for the common
        //columns being prepared. The attributes that are not in the right  are filled with null in the resultant
        //relation.
        it(
          "usage",
          async () => {
            const select = `select student.name,student.ID
                            from student natural left outer join takes;`;
            const result = await utils.runNonParametricQueryAsync(
              connection,
              select
            );

            const resultAsArray = result.map((tuple) => {
              const { ID, name } = tuple;
              return [ID, name];
            });

            // Snow is shown though he has not taken any course.
            const expected = [
              ["00128", "Zhang"],
              ["00128", "Zhang"],
              ["12345", "Shankar"],
              ["12345", "Shankar"],
              ["12345", "Shankar"],
              ["12345", "Shankar"],
              ["19991", "Brandt"],
              ["23121", "Chavez"],
              ["44553", "Peltier"],
              ["45678", "Levy"],
              ["45678", "Levy"],
              ["45678", "Levy"],
              ["54321", "Williams"],
              ["54321", "Williams"],
              ["55739", "Sanchez"],
              ["70557", "Snow"],
              ["76543", "Brown"],
              ["76543", "Brown"],
              ["76653", "Aoi"],
              ["98765", "Bourikas"],
              ["98765", "Bourikas"],
              ["98988", "Tanaka"],
              ["98988", "Tanaka"],
            ];
            ensureDeeplyEqual(resultAsArray, expected);
          },
          MAX_TESTING_TIME_IN_MS
        );

        it(
          "more complex usage",
          async () => {
            //find students who have not taken any course.
            const select = `select ID
                          from student natural left outer join takes
                          where course_id is null;`;
            const result = await utils.runNonParametricQueryAsync(
              connection,
              select
            );

            const resultAsArray = result.map((tuple) => {
              return tuple.ID;
            });

            const expected = ["70557"];

            ensureDeeplyEqual(resultAsArray, expected);
          },
          MAX_TESTING_TIME_IN_MS
        );
      });

      describe("right outer join", () => {
        // The right outer join preserves tuples only in the relation named before (to the right
        //   of) the right outer join operation.
        //the atributes in the left relation are filled with nulls in the resultant relation

        it.only(
          "usage",
          async () => {
            const select = `select *
                             from takes natural right outer join student as right_join
                             where right_join.name="Snow"`;
            const result = await utils.runNonParametricQueryAsync(
              connection,
              select
            );

            const resultAsArray = result.map((tuple) => {
              const {
                ID,
                name,
                dept_name,
                tot_cred,
                course_id,
                sec_id,
                semester,
                year,
                grade,
              } = tuple;
              return [
                ID,
                name,
                dept_name,
                tot_cred,
                course_id,
                sec_id,
                semester,
                year,
                grade,
              ];
            });

            console.log(resultAsArray);

            const expected = [
              [
                "00128",
                "Zhang",
                "Comp. Sci.",
                102,
                "CS-101",
                "1",
                "Fall",
                2017,
                "A",
              ],
              [
                "00128",
                "Zhang",
                "Comp. Sci.",
                102,
                "CS-347",
                "1",
                "Fall",
                2017,
                "A-",
              ],
              [
                "12345",
                "Shankar",
                "Comp. Sci.",
                32,
                "CS-101",
                "1",
                "Fall",
                2017,
                "C",
              ],
              [
                "12345",
                "Shankar",
                "Comp. Sci.",
                32,
                "CS-190",
                "2",
                "Spring",
                2017,
                "A",
              ],
              [
                "12345",
                "Shankar",
                "Comp. Sci.",
                32,
                "CS-315",
                "1",
                "Spring",
                2018,
                "A",
              ],
              [
                "12345",
                "Shankar",
                "Comp. Sci.",
                32,
                "CS-347",
                "1",
                "Fall",
                2017,
                "A",
              ],
              [
                "19991",
                "Brandt",
                "History",
                80,
                "HIS-351",
                "1",
                "Spring",
                2018,
                "B",
              ],
              [
                "23121",
                "Chavez",
                "Finance",
                110,
                "FIN-201",
                "1",
                "Spring",
                2018,
                "C+",
              ],
              [
                "44553",
                "Peltier",
                "Physics",
                56,
                "PHY-101",
                "1",
                "Fall",
                2017,
                "B-",
              ],
              [
                "45678",
                "Levy",
                "Physics",
                46,
                "CS-101",
                "1",
                "Fall",
                2017,
                "F",
              ],
              [
                "45678",
                "Levy",
                "Physics",
                46,
                "CS-101",
                "1",
                "Spring",
                2018,
                "B+",
              ],
              [
                "45678",
                "Levy",
                "Physics",
                46,
                "CS-319",
                "1",
                "Spring",
                2018,
                "B",
              ],
              [
                "54321",
                "Williams",
                "Comp. Sci.",
                54,
                "CS-101",
                "1",
                "Fall",
                2017,
                "A-",
              ],
              [
                "54321",
                "Williams",
                "Comp. Sci.",
                54,
                "CS-190",
                "2",
                "Spring",
                2017,
                "B+",
              ],
              [
                "55739",
                "Sanchez",
                "Music",
                38,
                "MU-199",
                "1",
                "Spring",
                2018,
                "A-",
              ],
              ["70557", "Snow", "Physics", 0, null, null, null, null, null],
              [
                "76543",
                "Brown",
                "Comp. Sci.",
                58,
                "CS-101",
                "1",
                "Fall",
                2017,
                "A",
              ],
              [
                "76543",
                "Brown",
                "Comp. Sci.",
                58,
                "CS-319",
                "2",
                "Spring",
                2018,
                "A",
              ],
              [
                "76653",
                "Aoi",
                "Elec. Eng.",
                60,
                "EE-181",
                "1",
                "Spring",
                2017,
                "C",
              ],
              [
                "98765",
                "Bourikas",
                "Elec. Eng.",
                98,
                "CS-101",
                "1",
                "Fall",
                2017,
                "C-",
              ],
              [
                "98765",
                "Bourikas",
                "Elec. Eng.",
                98,
                "CS-315",
                "1",
                "Spring",
                2018,
                "B",
              ],
              [
                "98988",
                "Tanaka",
                "Biology",
                120,
                "BIO-101",
                "1",
                "Summer",
                2017,
                "A",
              ],
              [
                "98988",
                "Tanaka",
                "Biology",
                120,
                "BIO-301",
                "1",
                "Summer",
                2018,
                null,
              ],
            ];

            ensureDeeplyEqual(resultAsArray, expected);
          },
          MAX_TESTING_TIME_IN_MS
        );

        it(
          "more complex usage",
          async () => {
            //find students who have not taken any course.
            const select = `select ID
                          from student natural left outer join takes
                          where course_id is null;`;
            const result = await utils.runNonParametricQueryAsync(
              connection,
              select
            );

            const resultAsArray = result.map((tuple) => {
              return tuple.ID;
            });

            const expected = ["70557"];

            ensureDeeplyEqual(resultAsArray, expected);
          },
          MAX_TESTING_TIME_IN_MS
        );
      });
    });
  });
});
