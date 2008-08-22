/*
	Offspring.js -- adds the following classes as needed:

		.first-child
		.last-child
		.only-child
		.nth-child-odd
		.nth-child-even
		.nth-child-##
		
	Configuration:
	
	Offspring can be configured by defining an "offspringConfiguration" 
	object before referencing offspring.js. That object can contain
	one or more of these parameters. (If any parameter is omitted -- which
	is fine -- it gets the default value as described below.) 
	
	offspringConfiguration = 
	{
		runningMode: 'full',                        <-- valid values are 'full' and 'light' (default: 'full')
		autoStart: true,                            <-- valid values are true and false (default: true)
		shouldRemoveOldOffspringClassesFirst: false <-- valid values are true and false (default: false)
	}
	
	* runningMode: 
		'full' -- Offspring applies all of its classes (as listed at the very top) [default]
		'light' -- Offspring only applies 'first-child', 'last-child', and 'only-child',
					omitting 'nth-child-odd', 'nth-child-even', and 'nth-child-##'.
					(This may allow for faster page-processing in certain scenarios.)
					
	* autoStart:
		true -- Offspring runs automatically as soon as the DOM is ready [default]
		false -- Offspring must be run manually. This can be done by calling Offspring.start();
		
	* shouldRemoveOldOffspringClassesFirst:
		true --Offspring first removes any old Offspring classes before applying the new ones.
				(This might be of use if Offspring is to be called on a page that has already
				been processed, such as if a table has been sorted or content has been loaded
				via Ajax.)
		false -- Offspring applies its classes without first removing old Offspring classes that
				might be there. Unless you're doing fancy DOM updates, this is probably the
				better option in most cases. [default]

	================================================================== */


var offspring = {
	firstChildClass: "first-child",
	lastChildClass:  "last-child",
	oddChildClass:   "nth-child-odd",
	evenChildClass:  "nth-child-even",
	onlyChildClass:  "only-child",
	nthChildClassPrefix:   "nth-child-",

	classNamesArray: [],
	classNameSubstringsArray: [],

	cacheLevel: 0, // current size of the classNames cache

	nthChildren: [],

	regularHashTable: [],
	regularHashTableArray: [],

	lastChildHashTable: [],
	lastChildHashTableArray: [],

	/* Configuration defaults */
	configuration:
	{
		runningMode: 'full', /* Possible values: 'full' / 'light' */
		autoStart: true, /* If Offspring is configured in autoStart mode (which it is by default),
		 					it runs as soon as the DOM is ready */
		shouldRemoveOldOffspringClassesFirst: false /* If this is set to 'true', Offspring first
														removes any old Offspring-related classes
														before applying the new ones */
	},

	// Initialize
	init: function() {

		/*
			Offspring's configuration is stored in Offspring.configuration, but
			that con be overridden by users by defining an "offspringConfiguratin"
			object.
		*/
		if (typeof offspringConfiguration != "undefined")
		{
			for (var configParameter in offspringConfiguration)
			{
				this.configuration[configParameter] = offspringConfiguration[configParameter];
			}

			// Make sure this option is stored in lowercase
			this.configuration.runningMode = this.configuration.runningMode.toLowerCase();
		}


		/* Set the values for classNamesArray & classNameSubstringArray */

		switch (this.configuration.runningMode)
		{
			case 'full':
				// this represents all possible offspring-related classnames
				this.classNamesArray = [this.firstChildClass, this.lastChildClass, this.oddChildClass, this.evenChildClass, this.onlyChildClass];

				// this represents a list of substrings to match such as for removing classNames
				this.classNameSubstringsArray = [this.nthChildClassPrefix];
				break;

			case 'light':
				// this represents all possible offspring-related classnames
				this.classNamesArray = [this.firstChildClass, this.lastChildClass, this.onlyChildClass];

				// this represents a list of substrings to match such as for removing classNames
				this.classNameSubstringsArray = [];
				break;
		}

		// Define the iterator function on-the-fly depending
		// on the configuration options that were sent in
		this.defineTraverseChildrenFunction();

		// Define the fillCacheTo funtion's iterator on-the-fly
		// depending on the configuration options that were sent in
		this.defineFillCacheToFunction();
		this.fillCacheTo(); // seed the cache with a basic set of values

 
		/* If Offspring is configured in autoStart mode (which it is by default),
		 	it runs as soon as the DOM is ready */
		if (this.configuration.autoStart)
		{
			var _this = this; // Closure

			this.ContentLoaded(window, function() {
				_this.start();
			});			
		}

	},

	// Executed once the page has loaded
	start: function() {
		var startTime = new Date();

		this.traverseChildren(document.getElementsByTagName("body")[0]);

		var endTime = new Date();
		// alert("Offspring Exec time: " + (endTime.getTime() - startTime.getTime()) + "ms");
		// window.status += "Offspring Exec time: " + (endTime.getTime() - startTime.getTime()) + "ms";

	},

	/* Maintenance note for defineTraverseChildrenFunction:
	
		There are several blocks of code that are marked off as "traverseChildren.A"
		or "traverseChildren.B" -- each of these are identical, respectively. (That is,
		all "traverseChildren.A" blocks are the same and all "traverseChildren.B" are 
		the same.) 
		
		So, why not just create a function where the code can be kept in one place? 
		While normally a sensible idea, I decided against that approach only so 
		that the speed hits associated with the creation of the function stack
		could be averted. At the same time, I didn't want to compromise
		the code's maintainability; so, if any block needs to be updated, they
		can all be kept in sync with some basic copy-n-pasting from one 
		block to the next.
	*/


	/* This defines the internal iterator function on-the-fly,
		depending on the configuration options */
	defineTraverseChildrenFunction: function() {

		switch (this.configuration.shouldRemoveOldOffspringClassesFirst)
		{
			case true: // shouldRemoveOldOffspringClassesFirst is true

				switch (this.configuration.runningMode)
				{
					case 'full': // 'full' running mode and shouldRemoveOldOffspringClassesFirst is true
						this.traverseChildren = function(parent)
						{
							/* ============= Begin Code Block "traverseChildren.A" ================ */

								// If the node has no children, exit
								if (!parent.childNodes.length) return;


								/* First, gather up all the element nodes */
								var childElementNodes = [];

								var testNode = parent.childNodes[0]; // initialize

								while (testNode)
								{
									if (testNode.nodeType == 1)
									{
										childElementNodes.push(testNode);
									}
									testNode = testNode.nextSibling;
								}

								/*
									empty this variable to ensure that the JavaScript
									interpreter doesn't have to update the variable's
									nodelist as DOM changes are made
								*/
								testNode = null;

								var childElementNodesLength = childElementNodes.length;

								// If no element nodes were found, exit
								if (!childElementNodesLength) return;

								// Make sure that the CSS-classnames cache has enough entries to cover
								// the number of child nodes
								if (childElementNodesLength > this.cacheLevel)
								{
									this.fillCacheTo(childElementNodesLength);
								}

								var lastIndex = childElementNodesLength - 1; // index of the last element node

							/* ============= /End Code Block "traverseChildren.A" ================ */

							// First, take care of all but the last element
							for (var i = 0; i < lastIndex; i++)
							{
								var currentElement = childElementNodes[i];

								this.removeMultipleClassNames(currentElement, this.classNamesArray, this.classNameSubstringsArray);

								// argument syntax: node to act upon, current index, boolean for whether isLast
								this._addOffspringClassNames(currentElement, i, false);
								this.traverseChildren(currentElement);
							}

							currentElement = null; // prevent memory leaks

							// Then, take care of the last one
							var lastElement = childElementNodes[lastIndex];

							this.removeMultipleClassNames(lastElement, this.classNamesArray, this.classNameSubstringsArray);

							this._addOffspringClassNames(lastElement, lastIndex, true);
							this.traverseChildren(lastElement);

							lastElement = null; // prevent memory leaks

							/* ============= Begin Code Block "traverseChildren.B" ================ */

								// prevent memory leaks
								lastElement = null;
								parent = null;

							/* ============= /End Code Block "traverseChildren.B" ================ */

						}; // end of traverseChildren function definition
						break;

					case 'light': // 'light' running mode and shouldRemoveOldOffspringClassesFirst is true
						this.traverseChildren = function(parent)
						{
							/* ============= Begin Code Block "traverseChildren.A" ================ */

								// If the node has no children, exit
								if (!parent.childNodes.length) return;


								/* First, gather up all the element nodes */
								var childElementNodes = [];

								var testNode = parent.childNodes[0]; // initialize

								while (testNode)
								{
									if (testNode.nodeType == 1)
									{
										childElementNodes.push(testNode);
									}
									testNode = testNode.nextSibling;
								}

								/*
									empty this variable to ensure that the JavaScript
									interpreter doesn't have to update the variable's
									nodelist as DOM changes are made
								*/
								testNode = null;

								var childElementNodesLength = childElementNodes.length;

								// If no element nodes were found, exit
								if (!childElementNodesLength) return;

								// Make sure that the CSS-classnames cache has enough entries to cover
								// the number of child nodes
								if (childElementNodesLength > this.cacheLevel)
								{
									this.fillCacheTo(childElementNodesLength);
								}

								var lastIndex = childElementNodesLength - 1; // index of the last element node

							/* ============= /End Code Block "traverseChildren.A" ================ */

							switch (childElementNodesLength)
							{
								case 0: return;
										break;

								case 1:
									/* Take care of the only element */

									var onlyElement = childElementNodes[0];
									this.removeMultipleClassNames(onlyElement, this.classNamesArray, this.classNameSubstringsArray);

									// argument syntax: node to act upon, current index, boolean for whether isLast
									this._addOffspringClassNames( onlyElement, lastIndex, true );

									onlyElement = null; // prevent memory leaks

									break;

								default:
									/* Take care of the first element */

									var firstElement = childElementNodes[0];
									this.removeMultipleClassNames(firstElement, this.classNamesArray, this.classNameSubstringsArray);

									// argument syntax: node to act upon, current index, boolean for whether isLast
									this._addOffspringClassNames( firstElement, 0, false );

									firstElement = null; // prevent memory leaks

									/* Take care of the last element */

									var lastElement = childElementNodes[lastIndex];
									this.removeMultipleClassNames(lastElement, this.classNamesArray, this.classNameSubstringsArray);

									// argument syntax: node to act upon, current index, boolean for whether isLast
									this._addOffspringClassNames( lastElement , lastIndex, true );

									lastElement = null; // prevent memory leaks

									break;

							} // end of switch statement for childElementNodesLength

							// Lastly, loop over all the childern elements
							for (var i = 0; i < childElementNodesLength; i++)
							{
								this.traverseChildren( childElementNodes[i] );
							}

							/* ============= Begin Code Block "traverseChildren.B" ================ */

								// prevent memory leaks
								lastElement = null;
								parent = null;

							/* ============= /End Code Block "traverseChildren.B" ================ */

						}; // end of traverseChildren function definition

						break;

				} // end of switch-statement for configuration.runningMode

				break;

			case false: // shouldRemoveOldOffspringClassesFirst is false

				switch (this.configuration.runningMode)
				{
					case 'full': // 'full' running mode and shouldRemoveOldOffspringClassesFirst is false
						this.traverseChildren = function(parent)
						{
							/* ============= Begin Code Block "traverseChildren.A" ================ */

								// If the node has no children, exit
								if (!parent.childNodes.length) return;


								/* First, gather up all the element nodes */
								var childElementNodes = [];

								var testNode = parent.childNodes[0]; // initialize

								while (testNode)
								{
									if (testNode.nodeType == 1)
									{
										childElementNodes.push(testNode);
									}
									testNode = testNode.nextSibling;
								}

								/*
									empty this variable to ensure that the JavaScript
									interpreter doesn't have to update the variable's
									nodelist as DOM changes are made
								*/
								testNode = null;

								var childElementNodesLength = childElementNodes.length;

								// If no element nodes were found, exit
								if (!childElementNodesLength) return;

								// Make sure that the CSS-classnames cache has enough entries to cover
								// the number of child nodes
								if (childElementNodesLength > this.cacheLevel)
								{
									this.fillCacheTo(childElementNodesLength);
								}

								var lastIndex = childElementNodesLength - 1; // index of the last element node

							/* ============= /End Code Block "traverseChildren.A" ================ */

							// First, take care of all but the last element
							for (var i = 0; i < lastIndex; i++)
							{
								var currentElement = childElementNodes[i];

								// argument syntax: node to act upon, current index, boolean for whether isLast
								this._addOffspringClassNames(currentElement, i, false);
								this.traverseChildren(currentElement);
							}

							currentElement = null; // prevent memory leaks

							/*
								Then, take care of the last one
								(this set of code isn't integrated into
								the for-loop above so as to avoid having
								an addiitional if-statement inside there)
							*/
							var lastElement = childElementNodes[lastIndex];

							this._addOffspringClassNames(lastElement, lastIndex, true);
							this.traverseChildren(lastElement);
							lastElement = null; // prevent memory leaks

							/* ============= Begin Code Block "traverseChildren.B" ================ */

								// prevent memory leaks
								lastElement = null;
								parent = null;

							/* ============= /End Code Block "traverseChildren.B" ================ */

						}; // end of traverseChildren function definition
						break;

					case 'light': // 'light' running mode and shouldRemoveOldOffspringClassesFirst is false
						this.traverseChildren = function(parent)
						{
							/* ============= Begin Code Block "traverseChildren.A" ================ */

								// If the node has no children, exit
								if (!parent.childNodes.length) return;


								/* First, gather up all the element nodes */
								var childElementNodes = [];

								var testNode = parent.childNodes[0]; // initialize

								while (testNode)
								{
									if (testNode.nodeType == 1)
									{
										childElementNodes.push(testNode);
									}
									testNode = testNode.nextSibling;
								}

								/*
									empty this variable to ensure that the JavaScript
									interpreter doesn't have to update the variable's
									nodelist as DOM changes are made
								*/
								testNode = null;

								var childElementNodesLength = childElementNodes.length;

								// If no element nodes were found, exit
								if (!childElementNodesLength) return;

								// Make sure that the CSS-classnames cache has enough entries to cover
								// the number of child nodes
								if (childElementNodesLength > this.cacheLevel)
								{
									this.fillCacheTo(childElementNodesLength);
								}

								var lastIndex = childElementNodesLength - 1; // index of the last element node

							/* ============= /End Code Block "traverseChildren.A" ================ */

							switch (childElementNodesLength)
							{
								case 0: break;

								case 1:
									/* Take care of the only element */

									// argument syntax: node to act upon, current index, boolean for whether isLast
									this._addOffspringClassNames( childElementNodes[0], lastIndex, true );

									// Lastly, loop over all the childern elements
									for (var i = 0; i < childElementNodesLength; i++)
									{
										this.traverseChildren( childElementNodes[i] );
									}

									break;

								default:
									/* Take care of the first element */

									// argument syntax: node to act upon, current index, boolean for whether isLast
									this._addOffspringClassNames( childElementNodes[0], 0, false );

									/* Take care of the last element */

									// argument syntax: node to act upon, current index, boolean for whether isLast
									this._addOffspringClassNames( childElementNodes[lastIndex] , lastIndex, true );

									// Lastly, loop over all the childern elements
									for (var i = 0; i < childElementNodesLength; i++)
									{
										this.traverseChildren( childElementNodes[i] );
									}

									break;
							}

							/* ============= Begin Code Block "traverseChildren.B" ================ */

								// prevent memory leaks
								lastElement = null;
								parent = null;

							/* ============= /End Code Block "traverseChildren.B" ================ */

						}; // end of traverseChildren function definition

						break;
				} // end of switch-statement for configuration.runningMode

				break;

		} // end of switch-statement for configuration.shouldRemoveOldOffspringClassesFirst

	}, // end of defineTraverseChildrenFunction

	// Recursive

	/*
		If "shouldRemoveOldOffspringClassesFirst" is deined and set to true
	 	(it's optional), traverseChildren will remove old Offspring-related
	 	classes before applying new ones to a node. This could be useful
	 	for reapplying classes if the DOM is rejiggered.
	*/

	traverseChildren: function(parent) {

		/* ============= Begin Code Block "traverseChildren.A" ================ */

			// If the node has no children, exit
			if (!parent.childNodes.length) return;


			/* First, gather up all the element nodes */
			var childElementNodes = [];

			var testNode = parent.childNodes[0]; // initialize

			while (testNode)
			{
				if (testNode.nodeType == 1)
				{
					childElementNodes.push(testNode);
				}
				testNode = testNode.nextSibling;
			}

			/*
				empty this variable to ensure that the JavaScript
				interpreter doesn't have to update the variable's
				nodelist as DOM changes are made
			*/
			testNode = null;

			var childElementNodesLength = childElementNodes.length;

			// If no element nodes were found, exit
			if (!childElementNodesLength) return;

			// Make sure that the CSS-classnames cache has enough entries to cover
			// the number of child nodes
			if (childElementNodesLength > this.cacheLevel)
			{
				this.fillCacheTo(childElementNodesLength);
			}

			var lastIndex = childElementNodesLength - 1; // index of the last element node

		/* ============= /End Code Block "traverseChildren.A" ================ */


		/* ==== Add the classes ====== */

		this._childrenIterator(childElementNodes, childElementNodesLength, lastIndex);


		/* ============= Begin Code Block "traverseChildren.B" ================ */

			// prevent memory leaks
			lastElement = null;
			parent = null;

		/* ============= /End Code Block "traverseChildren.B" ================ */

	},

	/*
		This function adds the Offspring classnames to a given element,
		given its position among it siblings (with zero being "first")
		and whether it's the last element in its set.
	*/
	_addOffspringClassNames: function(element, index, isLastElement) {

		index++; // normalize since the arrays are indexed with a "1" starting point

		// Steps if the element has no existing classnames...

		if ((!element.className) || (!element.className.length))
		{
			switch (isLastElement)
			{
				case false: // it isn't the last element
						element.className = this.regularHashTable[index];
						return;
						break;

				case true: // it is the last element
				 		element.className = this.lastChildHashTable[index];
						return;
						break;

			} // end of isLastElement switch-statement

		} // end of if-statement for checking whether the element has no existing className

		// At this point, the incoming element already has className(s)

		switch (isLastElement)
		{
			case false: // it isn't the last element
					var applicableClassNames = this.regularHashTableArray[index];
					break;

			case true: // it is the last element
					var applicableClassNames = this.lastChildHashTableArray[index];
					break;

		} // end of isLastElement switch-statement

		var originalClassNames = element.className.split(' ');

		var classNamesToAdd = originalClassNames; // initialize

		for (var i = 0, applicableClassNamesLength = applicableClassNames.length; i < applicableClassNamesLength; i++)
		{
			var alreadyThere = false; // boolean for whether a given class name is already assigned to the element

			var testApplicableClassName = applicableClassNames[i];

			for (var j = 0, originalClassNamesLength = originalClassNames.length; j < originalClassNamesLength; j++)
			{
				if (originalClassNames[j] == testApplicableClassName)
				{
					alreadyThere = true;
					break;
				} // end of if-statement for checking if the element already has a given className

			} // end of the originalClassNames for-loop

			if (!alreadyThere)
			{
				classNamesToAdd.push(testApplicableClassName);
			}

		} // end of applicableClassNames for-loop


		// Then, after checking over the element's existing classNames, add the new version
		element.className = classNamesToAdd.join(' ');
		element = null; // prevent memory leaks

		return;

	}, // end of _addOffspringClassNames()

	/* Maintenance note for defineFillCacheToFunction:
	
		[Aside: This is basically conveys the same idea as the comment above 
		defineTraverseChildrenFunction. So, if you're read that one, you 
		probably already have the basic idea of what's going on here.]
	
		There are several blocks of code that are marked off as "fillCacheTo.A"
		or "fillCacheTo.B" -- each of these are identical, respectively. (That is,
		all "fillCacheTo.A" blocks are the same and all "fillCacheTo.B" are 
		the same.) 
		
		So, why not just create a function where the code can be kept in one place? 
		While normally a sensible idea, I decided against that approach only so 
		that the speed hits associated with the creation of the function stack
		could be averted. At the same time, I didn't want to compromise
		the code's maintainability; so, if any block needs to be updated, they
		can all be kept in sync with some basic copy-n-pasting from one 
		block to the next.
	*/


	/* This defines the internal loop function for fillCacheTo,
		depending on how the configuration options are set */
	defineFillCacheToFunction: function() {

		switch (this.configuration.runningMode)
		{
			case 'full': // 'full' running mode
				this.fillCacheTo = function(fillAmount)
				{
					/* ============= Begin Code Block "fillCacheTo.A" ================ */

						var fillAmount = fillAmount || 15; // default value

						if (!this.cacheLevel) this.cacheLevel = 0; // set this to a default value if needed

						// If the cache level is already full enough, exit
						if (this.cacheLevel >= fillAmount) return;

						var startingPoint = this.cacheLevel++;

					/* ============= /End Code Block "fillCacheTo.A" ================ */

					var isOdd = !((startingPoint % 2) == 0); // initialize

					// cache these object name resolutions
					var firstChildClass = this.firstChildClass;
					var lastChildClass = this.lastChildClass;
					var oddChildClass = this.oddChildClass;
					var evenChildClass = this.evenChildClass;
					var onlyChildClass = this.onlyChildClass;
					var nthChildClassPrefix = this.nthChildClassPrefix;

					for (var i = startingPoint; i <= fillAmount; i++)
					{
						this.nthChildren[i] = [nthChildClassPrefix, i].join('');

						var nthChildrenI = this.nthChildren[i]; // cache this look-up

						switch (i)
						{
							case 1:
									this.regularHashTableArray[i] = [firstChildClass, oddChildClass, nthChildrenI];
									this.lastChildHashTableArray[i] = [firstChildClass, oddChildClass, onlyChildClass, nthChildrenI, lastChildClass];
									break;

							default:
									switch (isOdd)
									{
										case true: // "odd" is true
												this.regularHashTableArray[i] = [oddChildClass, nthChildrenI];
												this.lastChildHashTableArray[i] = [oddChildClass, nthChildrenI, lastChildClass];
												break;

										case false: // "odd" is false
												this.regularHashTableArray[i] = [evenChildClass, nthChildrenI];
												this.lastChildHashTableArray[i] = [evenChildClass, nthChildrenI, lastChildClass];
												break;

									} // end of isOdd switch-statement


						} // end of switch-statement for i

						// Now make the joined versions for a given "i"

						this.regularHashTable[i] = this.regularHashTableArray[i].join(' ');
						this.lastChildHashTable[i] = this.lastChildHashTableArray[i].join(' ');

						isOdd = !isOdd; // flip the isOdd flag

					} // end of filling for-loop

					/* ============= Begin Code Block "fillCacheTo.B" ================ */

						// If it got this far, the cacheLevel must made it to the fill amount, so update that
						this.cacheLevel = fillAmount;

					/* ============= /End Code Block "fillCacheTo.B" ================ */

				}; // end of fillCacheTo function definition
				break;

			case 'light': // 'light' running mode
				this.fillCacheTo = function(fillAmount)
				{
					/* ============= Begin Code Block "fillCacheTo.A" ================ */

						var fillAmount = fillAmount || 15; // default value

						if (!this.cacheLevel) this.cacheLevel = 0; // set this to a default value if needed

						// If the cache level is already full enough, exit
						if (this.cacheLevel >= fillAmount) return;

						var startingPoint = this.cacheLevel++;

					/* ============= /End Code Block "fillCacheTo.A" ================ */

					// cache these object name resolutions
					var firstChildClass = this.firstChildClass;
					var lastChildClass = this.lastChildClass;

					var onlyChildClass = this.onlyChildClass;

					for (var i = startingPoint; i <= fillAmount; i++)
					{

						switch (i)
						{
							case 1:
									this.regularHashTableArray[i] = [firstChildClass];
									this.lastChildHashTableArray[i] = [firstChildClass, onlyChildClass, lastChildClass];
									break;

							default:

									this.regularHashTableArray[i] = [];
									this.lastChildHashTableArray[i] = [lastChildClass];

						} // end of switch-statement for i

						// Now make the joined versions for a given "i"

						this.regularHashTable[i] = this.regularHashTableArray[i].join(' ');
						this.lastChildHashTable[i] = this.lastChildHashTableArray[i].join(' ');

					} // end of filling for-loop

					/* ============= Begin Code Block "fillCacheTo.B" ================ */

						// If it got this far, the cacheLevel must made it to the fill amount, so update that
						this.cacheLevel = fillAmount;

					/* ============= /End Code Block "fillCacheTo.B" ================ */

				}; // end of fillCacheTo function definition
				break;

		} // end of switch statement for this.configuration.runningMode

	}, // end of defineFillCacheToFunction

	// This fills the className caches to the specified amount
	fillCacheTo: function(fillAmount) {

		/* ============= Begin Code Block "fillCacheTo.A" ================ */

			var fillAmount = fillAmount || 15; // default value

			if (!this.cacheLevel) this.cacheLevel = 0; // set this to a default value if needed

			// If the cache level is already full enough, exit
			if (this.cacheLevel >= fillAmount) return;

			var startingPoint = this.cacheLevel++;

		/* ============= /End Code Block "fillCacheTo.A" ================ */

		this._fillCacheToIterator(startingPoint, fillAmount);

		/* ============= Begin Code Block "fillCacheTo.B" ================ */

			// If it got this far, the cacheLevel must made it to the fill amount, so update that
			this.cacheLevel = fillAmount;

		/* ============= /End Code Block "fillCacheTo.B" ================ */

	}, // end of fillCacheTo()

	/* Returns true if testString is found in the array,
		or returns false otherwise */
	_checkIfStringFoundInArray: function(testString, testArray) {

		// Loop through all testArray[] and if/when there's a match, return true
		for (var i = 0, len=testArray.length; i < len; i++)
		{
			if (testString == testArray[i]) return true;
		}

		// If it got this far, it must not have found the string in the array
		return false;

	}, // end of _checkIfStringFoundInArray

	/* Returns true if the beginning of testString matches one of the substrings
		in the array. Otherwise, it returns false.

		For example, given the array ['plum', 'orange', 'pine'] and
		the testString 'pineapples', the function would return true. However,
		given the testString 'range', it would return false (since none of
		the strings in the array start with 'range')
	*/
	_checkIfStringMatchInSubstringArray: function(testString, testArray) {

		// Loop through all testArray[] and if/when there's a match, return true
		for (var i = 0, len=testArray.length; i < len; i++)
		{
			var currentArrayItem = testArray[i];

			/* string.substr() accepts two parameters:
				- The starting point of the substring
				- The length of the substring
			*/
			var testSubstring = testString.substr(0, currentArrayItem.length);

			if (testSubstring == currentArrayItem) return true;
		}

		// If it got this far, it must not have found the string in the array
		return false;

	}, // end of _checkIfStringMatchInSubstringArray

	/*
		This removes multiple classnames from an element. It does this by
		checking each of an element's class names against
		classNameStrings[] for an exact match and, if a given class name
		didn't match there, it's then checked to see if it matches
		as a substring against classNAmeSubstrings[].

		Of note, when comparing substrings, this intentionally only compares
		the beginning of the strings for a match. So, for example, "ora" would
		match as a substring of "orange", but "range" would not match as a substring
		of "orange". It was done this way because that was the only type of substring-
		comparison that was needed in this case, and a more thorough substring
		comparison would needlesslly use processor time.
	*/
	removeMultipleClassNames: function(element, classNameStrings, classNameSubstrings) {

		if (!element) return;
		var newClassName = '';
		var classNamesArray = element.className.split(' ');

    	for (var i = 0, len = classNamesArray.length; i < len; i++)
		{
			var currentClassName = classNamesArray[i];

			var isStringInClassNameStrings = this._checkIfStringFoundInArray(currentClassName, classNameStrings);

			if (isStringInClassNameStrings) continue;

			var isStringMatchingClassNameSubstrings = this._checkIfStringMatchInSubstringArray(currentClassName, classNameSubstrings);

			if (isStringMatchingClassNameSubstrings) continue;

			// If it got this far, it must not have matched any of the potential classNameStrings
			// or classNameRegexes, so add the current iteration to the neClassName

			if (i > 0) newClassName = newClassName + ' ';
    		newClassName = newClassName + currentClassName;

    	}
   		element.className = newClassName;

	}, // end of removeMultipleClassNames


	/*
	 *
	 * ContentLoaded.js
	 *
	 * Author: Diego Perini (diego.perini at gmail.com)
	 * Summary: Cross-browser wrapper for DOMContentLoaded
	 * Updated: 05/10/2007
	 * License: GPL/CC
	 * Version: 1.0
	 *
	 * http://javascript.nwbox.com/ContentLoaded/
	 *
	 * Notes:
	 *
	 *  based on code by Dean Edwards and John Resig
	 *  http://dean.edwards.name/weblog/2006/06/again/
	 *
	 *
	 */

	/*
	 * Example call, in this case:

	 	Offspring.ContentLoaded(window,
			function () {
				document.body.style.backgroundColor = 'green';
			}
		);
	*
	*/

	// @w	window reference
	// @f	function reference
	ContentLoaded: function (w, fn) {
		var d = w.document,
			u = w.navigator.userAgent.toLowerCase();

		function init(e) {
			if (!arguments.callee.done) {
				arguments.callee.done = true;
				fn(e);
			}
		}

		// konqueror/safari
		if (/khtml|webkit/.test(u)) {

			(function () {
				if (/complete|loaded/.test(d.readyState)) {
					init('poll');
				} else {
					setTimeout(arguments.callee, 10);
				}
			})();

		// internet explorer all versions
		} else if (/msie/.test(u) && !w.opera) {

			(function () {
				try {
					d.documentElement.doScroll('left');
				} catch (e) {
					setTimeout(arguments.callee, 10);
					return;
				}
				init('poll');
			})();
			d.attachEvent('onreadystatechange',
				function (e) {
					if (d.readyState == 'complete') {
						d.detachEvent('on'+e.type, arguments.callee);
						init(e.type);
					}
				}
			);

		// browsers having native DOMContentLoaded
		} else if (d.addEventListener &&
			(/gecko/.test(u) && parseFloat(u.split('rv:')[1]) >= 1.8) ||
			(/opera/.test(u) && parseFloat(u.split('opera ')[1]) > 9)) {

			d.addEventListener('DOMContentLoaded',
				function (e) {
					this.removeEventListener(e.type, arguments.callee, false);
					init(e.type);
				}, false
			);

		// fallback to last resort
		} else {

			// from Simon Willison
			var oldonload = w.onload;
			w.onload = function (e) {
				if (typeof oldonload == 'function') {
					oldonload(e || w.event);
				}
				init((e || w.event).type);
			};

		}
	} // end of ContentLoaded

}


// Kick off
offspring.init();