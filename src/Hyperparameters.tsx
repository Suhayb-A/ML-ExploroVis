import React from "react";

const NUMBER_TYPES = ["range", "number"];

function Hyperparameters({
  title,
  parameters,
  setParameters,
  onRun,
  children,
}: {
  title: string;
  parameters: any;
  setParameters: (parameters: any) => void;
  onRun?: () => void;
  children: any;
}) {
  const visableParameters = parameters
    ? parameters.filter((p) => p.tag !== "hidden")
    : undefined;
  return (
    <div id="hyperparameter-tools">
      <h3>{title}</h3>
      <div id="hyperparameter-container">
        {children}
        <div id="hyperparameter">
          <div id="hyperparameter-options">
            {visableParameters &&
              visableParameters.map((param, i) => {
                const Input = param.tag;
                const isNumber = NUMBER_TYPES.indexOf(param.value.type) !== -1;

                const values = { ...param.value };
                delete values["default"];
                const onChange = (event) => {
                  const value = event.target.value;
                  parameters[i] = { ...parameters[i] };
                  parameters[i]["value"] = {
                    ...parameters[i]["value"],
                    value: isNumber ? Number(value) : value,
                  };
                  setParameters([...parameters]);
                };
                return (
                  <React.Fragment key={param._id}>
                    <label>{param.title}</label>
                    {Input === "select" ? (
                      <Input value={values.value} onChange={onChange}>
                        {values.options.map((option) => {
                          if (typeof option === "string") {
                            return (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            );
                          } else {
                            const key = Object.keys(option)[0];
                            return (
                              <option key={key} value={key}>
                                {option[key]}
                              </option>
                            );
                          }
                        })}
                      </Input>
                    ) : (
                      <div className="hyperparameter-option-group">
                        <Input {...param.value} onChange={onChange} />
                        {param.value.type === "range" && (
                          <Input
                            className="hyperparameter-option-secondary"
                            {...param.value}
                            type="number"
                            onChange={onChange}
                          />
                        )}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
          </div>
          {visableParameters && visableParameters.length && onRun ? (
            <div className="button add-button" onClick={onRun}>
              Run
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default Hyperparameters;
